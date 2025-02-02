use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;
use rune::RuneIter;
use std::{mem, time::Duration};
use strum::IntoEnumIterator;

mod audio;
mod rune;

use crate::components::arx_fatalis::models::CxSpells;
pub use audio::init_audio;
pub use rune::Rune;

#[derive(Clone)]
pub struct CxRunes {
    inner: Signal<Inner>,
    service: UseFuture,
}

impl CxRunes {
    pub fn iter() -> RuneIter {
        Rune::iter()
    }

    pub fn init() {
        let mut inner = use_signal(|| Inner::default());
        let spells = use_context::<CxSpells>();

        let service = use_future(move || {
            let mut spells = spells.clone();
            async move {
                while let Some(delay) = {
                    let mut w = inner.write();
                    if w.index < w.queue.len() {
                        let rune = w.queue.get(w.index).unwrap();
                        let delay = rune.play();

                        w.index += 1;
                        delay
                    } else {
                        tracing::debug!("ran out of runes to cast");
                        None
                    }
                } {
                    tracing::debug!("waiting {delay}ms to play next");
                    sleep(Duration::from_millis(delay)).await;
                }

                let seq = {
                    let mut w = inner.write();
                    w.index = 0;
                    mem::replace(&mut w.queue, vec![])
                };

                if seq.len() > 0 {
                    spells.try_cast(seq);
                }
            }
        });

        let runes = Self { inner, service };

        use_context_provider(|| runes);
    }

    pub fn push(&mut self, rune: Rune) {
        let mut w = self.inner.write();
        w.queue.push(rune);

        if self.service.finished() {
            self.service.restart();
        }
    }
}

struct Inner {
    pub queue: Vec<Rune>,
    pub index: usize,
}

impl Default for Inner {
    fn default() -> Self {
        Inner {
            queue: vec![],
            index: 0,
        }
    }
}
