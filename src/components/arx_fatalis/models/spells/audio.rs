use strum::IntoEnumIterator;

use crate::components::audio::AudioSrc;

use super::Spell;

pub fn init_audio() -> Vec<AudioSrc> {
    Spell::iter()
        .map(|spell| {
            (
                spell.as_src(),
                match spell {
                    // TODO: exceptions come here
                    _ => vec![],
                },
            )
        })
        .collect()
}
