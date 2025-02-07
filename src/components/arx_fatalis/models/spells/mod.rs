use dioxus::prelude::*;

use crate::{
    components::modal::*,
    utils::{LSCompatStruct, LSCompatType},
};

use super::runes::Rune;

mod audio;
mod spell;

pub(crate) use audio::init_audio;
use spell::Spell;

type CastSpells = Vec<Spell>;

impl LSCompatType for CastSpells {}
impl LSCompatStruct for CastSpells {
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
        if let Some((spell, page)) = Spell::by_seq(&seq) {
            spell.play();
            let name = spell.name();

            let count = self.with(|r| r.spells.iter().filter(|s| *s == &spell).count()) + 1;

            self.with_mut(|w| {
                w.score += spell.points();
                w.spells.push(spell);
                w.spells.save();
            });

            if count < 3 || count.rem_euclid(10) == 0 {
                MODAL.silent().en().prompt(rsx! {
                    p {
                        if count.rem_euclid(10) == 0 {
                            "Congrats! This is your {count}th time casting {name}"
                        } else {
                            "You cast {name} from page {page}:"
                        }
                    }
                    div {
                        {
                            seq.iter()
                                .map(|rune| {
                                    let src = rune.src_png();
                                    rsx! {
                                        img {
                                            key: "{rune}",
                                            alt: "{rune}",
                                            title: "{rune}",
                                            draggable: false,
                                            src,
                                        }
                                    }
                                })
                        }
                    }
                })
            }
        } else {
            Spell::Fizzle.play();
        }
    }
}
