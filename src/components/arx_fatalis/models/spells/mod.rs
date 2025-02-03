use dioxus::prelude::*;

mod audio;
mod spell;

use super::runes::Rune;
use crate::utils::LocalStorageCompatible;
pub(crate) use audio::init_audio;
use spell::Spell;

type CastSpells = Vec<Spell>;

impl LocalStorageCompatible for CastSpells {
    const STORAGE_KEY: &'static str = "arx-fatalis-cast-spells";
}

pub(crate) static SPELLS: GsSpells = Signal::global(|| {
    let spells = CastSpells::load();
    let score = spells.iter().map(|x| x.points()).sum();

    Spells { spells, score }
});

pub(crate) struct Spells {
    spells: CastSpells,
    score: u64,
}

type GsSpells = GlobalSignal<Spells>;

pub(crate) trait TrSpells {
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
