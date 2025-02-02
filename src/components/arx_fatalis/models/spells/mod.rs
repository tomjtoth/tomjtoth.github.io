use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

mod audio;
mod spell;

pub use audio::init_audio;
use spell::Spell;

use crate::{components::audio::CxAudio, utils::LocalStorageCompatible};

use super::runes::Rune;

#[derive(Clone)]
pub struct CxSpells {
    inner: Signal<Inner>,
    score: u64,
}

impl CxSpells {
    pub fn init() {
        let inner = Inner::load_sig();

        let mut score = 0;
        for x in &inner.read().spells {
            score += x.points()
        }

        use_context_provider(|| Self { inner, score });
    }

    pub fn score(&self) -> u64 {
        self.score
    }

    pub fn try_cast(&mut self, seq: Vec<Rune>, audio: &CxAudio) {
        if let Some((spell, _)) = Spell::by_seq(seq) {
            audio.play(&spell.as_src());
            self.score += spell.points();
            let mut w = self.inner.write();
            w.spells.push(spell);
            w.save();
        } else {
            audio.play(&Spell::Fizzle.as_src());
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Inner {
    spells: Vec<Spell>,
}

impl Default for Inner {
    fn default() -> Self {
        Self { spells: vec![] }
    }
}

impl LocalStorageCompatible for Inner {
    const STORAGE_KEY: &'static str = "arx-fatalis-cast-spells";
}
