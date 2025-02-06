use std::{collections::HashMap, mem, time::Duration};

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;
use rune::RuneIter;
use strum::IntoEnumIterator;

mod audio;
mod rune;

pub(crate) use audio::init_audio;
pub(crate) use rune::Rune;

use crate::utils::from_cache;

use super::*;

pub(crate) struct Runes {
    queue: Vec<Rune>,
    index: usize,
    service: UseFuture,
    png_cache: HashMap<Rune, String>,
    png_cache_checked: bool,
}

pub type GsRunes = GlobalSignal<Runes>;

pub(crate) static RUNES: GsRunes = GlobalSignal::new(|| {
    let service = use_future(|| async {
        while let Some(delay) = RUNES.with_mut(|w| {
            if w.index < w.queue.len() {
                let rune = w.queue.get(w.index).unwrap();
                let delay = rune.play();

                w.index += 1;
                delay
            } else {
                None
            }
        }) {
            tracing::debug!("waiting {delay}ms to play next");
            sleep(Duration::from_millis(delay)).await;
        }

        let seq = RUNES.with_mut(|w| {
            w.index = 0;
            mem::replace(&mut w.queue, vec![])
        });

        if seq.len() > 0 {
            SPELLS.try_cast(seq);
        }
    });

    use_future(|| async {
        let mut hm = HashMap::new();
        tracing::debug!("populating cached_urls");
        for rune in GsRunes::iter() {
            let url = rune.src_png();
            if let Ok(Some(cached)) = from_cache(&url).await {
                tracing::debug!("{url} is available as: {cached}");
                hm.insert(rune, cached);
            }
        }
        RUNES.with_mut(|w| {
            if hm.len() > 0 {
                w.png_cache = hm;
            }
            w.png_cache_checked = true
        });
        tracing::debug!("*DONE* populating cached_urls");
    });

    Runes {
        queue: vec![],
        index: 0,
        service,
        png_cache: HashMap::new(),
        png_cache_checked: false,
    }
});

pub(crate) trait TrRunes {
    fn iter() -> RuneIter {
        Rune::iter()
    }

    fn push(&self, rune: Rune);
    fn get_png(&self, rune: &Rune) -> Option<String>;
    fn cache_checked(&self) -> bool;
}

impl TrRunes for GsRunes {
    fn push(&self, rune: Rune) {
        self.with_mut(|w| {
            w.queue.push(rune);
            if w.service.finished() {
                w.service.restart();
            }
        });
    }

    fn get_png(&self, rune: &Rune) -> Option<String> {
        self.read().png_cache.get(rune).cloned()
    }

    fn cache_checked(&self) -> bool {
        self.read().png_cache_checked
    }
}
