pub(crate) mod runes;
pub(crate) mod spells;

use crate::components::audio::AudioSrc;
pub(crate) use runes::*;
pub(crate) use spells::*;

pub(crate) fn init_audio() -> Vec<AudioSrc> {
    let mut runes_vec = runes::init_audio();
    let mut spells_vec = spells::init_audio();
    spells_vec.append(&mut runes_vec);

    spells_vec
}
