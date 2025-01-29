use dioxus::{logger::tracing, signals::Signal};

use super::Rune;
use crate::components::audio::Audio;

pub struct Queue {
    inner: Vec<Rune>,
    index: usize,
    paused: bool,
}
pub type SigQueue = Signal<Queue>;

impl Default for Queue {
    fn default() -> Self {
        Queue {
            inner: vec![],
            index: 0,
            paused: true,
        }
    }
}

impl Queue {
    pub fn push(&mut self, rune: Rune) -> bool {
        self.inner.push(rune);

        // trigger playing first sound
        if self.paused {
            self.paused = false;
            true
        } else {
            false
        }
    }

    pub fn play(&mut self, audio: &Audio) -> Option<u64> {
        if self.index < self.inner.len() {
            let rune = self.inner.get(self.index).unwrap();
            let delay = audio.play(&rune.as_src());

            self.index += 1;
            delay
        } else {
            tracing::debug!("ran out of runes to cast");
            None
        }
    }

    pub fn extract(&mut self) -> Vec<Rune> {
        let ret_val = self.inner.to_owned();

        self.inner = vec![];
        self.index = 0;
        self.paused = true;

        ret_val
    }
}
