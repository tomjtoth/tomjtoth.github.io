use std::{mem, time::Duration};

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;
use rune::RuneIter;
use strum::IntoEnumIterator;

mod audio;
mod rune;

pub(crate) use audio::init_audio;
pub(crate) use rune::Rune;

use super::*;

pub(crate) struct Runes {
    queue: Vec<Rune>,
    index: usize,
    service: UseFuture,
}

pub type GsRunes = GlobalSignal<Runes>;

pub(crate) static RUNES: GsRunes = GlobalSignal::new(|| {
    let service = use_future(move || async move {
        while let Some(delay) = RUNES.with_mut(|w| {
            if w.index < w.queue.len() {
                let rune = w.queue.get(w.index).unwrap();
                let delay = rune.play();

                w.index += 1;
                delay
            } else {
                tracing::debug!("ran out of runes to cast");
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

    Runes {
        queue: vec![],
        index: 0,
        service,
    }
});

pub(crate) trait TrRunes {
    fn iter() -> RuneIter {
        Rune::iter()
    }

    fn push(&self, rune: Rune);
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
}
