use dioxus::signals::Signal;
use serde::{Deserialize, Serialize};

use super::Spell;
use crate::{
    components::{arx_fatalis::models::runes::Rune, audio::Audio},
    utils::LocalStorageCompatible,
};

#[derive(Serialize, Deserialize)]
pub struct CastSpells(Vec<Spell>, u64);
pub type SigCastSpells = Signal<CastSpells>;

impl LocalStorageCompatible for CastSpells {
    const STORAGE_KEY: &'static str = "arx-fatalis-cast-spells";
}

impl Default for CastSpells {
    fn default() -> Self {
        Self(vec![], 0)
    }
}

impl CastSpells {
    pub fn init() -> Self {
        Self::load()
    }

    pub fn try_cast(&mut self, seq: Vec<Rune>, audio: &Audio) {
        if let Some((spell, _)) = Spell::by_seq(seq) {
            audio.play(&spell.as_src());
            let (page, seq) = spell.details();
            self.1 += (page * (seq.len() as u8)) as u64;
            self.0.push(spell);
            self.save();
        } else {
            audio.play(&Spell::Fizzle.as_src());
        }
    }
}
