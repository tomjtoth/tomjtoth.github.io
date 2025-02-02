use dioxus::prelude::*;

mod audio;
mod spell;

use super::runes::Rune;
use crate::utils::LocalStorageCompatible;
pub use audio::init_audio;
use spell::Spell;

pub static SPELLS: GsSpells = Signal::global(|| {
    let spells = CastSpells::load();
    let score = spells.iter().map(|x| x.points()).sum();

    Spells { spells, score }
});

pub struct Spells {
    spells: CastSpells,
    score: u64,
}

pub type GsSpells = GlobalSignal<Spells>;

pub trait TrSpells {
    fn score(&self) -> u64;
    fn try_cast(&self, seq: Vec<Rune>);
}

impl TrSpells for GsSpells {
    fn score(&self) -> u64 {
        self.read().score
    }

    fn try_cast(&self, seq: Vec<Rune>) {
        if let Some((spell, _)) = Spell::by_seq(seq) {
            spell.play();

            self.with_mut(|w| {
                w.score += spell.points();
                w.spells.push(spell);
                w.spells.save();
            });
        } else {
            Spell::Fizzle.play();
        }
    }
}

type CastSpells = Vec<Spell>;

impl LocalStorageCompatible for CastSpells {
    const STORAGE_KEY: &'static str = "arx-fatalis-cast-spells";
}
