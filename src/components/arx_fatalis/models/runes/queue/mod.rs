use std::mem;

use dioxus::{logger::tracing, prelude::*};
use inner::Inner;

mod inner;

use super::Rune;
use crate::components::audio::Audio;

#[derive(Clone)]
pub struct CxQueue {
    inner: Signal<Inner>,
}

impl CxQueue {
    pub fn init() {
        let q = Self {
            inner: use_signal(|| Inner::default()),
        };

        use_context_provider(|| q);
    }

    pub fn push(&mut self, rune: Rune) -> bool {
        let mut w = self.inner.write();
        w.queue.push(rune);

        // trigger playing first sound
        if w.paused {
            w.paused = false;
            true
        } else {
            false
        }
    }

    // TODO: `use_context::<Audio>();` here (?)
    pub fn play(&mut self, audio: &Audio) -> Option<u64> {
        let mut w = self.inner.write();
        if w.index < w.queue.len() {
            let rune = w.queue.get(w.index).unwrap();
            let delay = audio.play(&rune.as_src());

            w.index += 1;
            delay
        } else {
            tracing::debug!("ran out of runes to cast");
            None
        }
    }

    pub fn extract(&mut self) -> Vec<Rune> {
        let mut w = self.inner.write();

        w.index = 0;
        w.paused = true;
        mem::replace(&mut w.queue, vec![])
    }
}
