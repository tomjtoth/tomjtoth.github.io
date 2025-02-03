use strum::IntoEnumIterator;

use crate::components::audio::{AudioOpt::*, AudioSrc};

use super::Spell::{self, *};

pub(crate) fn init_audio() -> Vec<AudioSrc> {
    Spell::iter()
        .map(|spell| match spell {
            ActivatePortal
            | MegaCheat
            | Fireball
            | Reveal
            | Trap
            | ManaDrain
            | Chaos
            | LifeDrain
            | MassLightningProjection
            | SlowTime => (spell.as_src(), vec![NotAvailable]),

            _ => (spell.as_src(), vec![Volume(0.75)]),
        })
        .collect()
}
