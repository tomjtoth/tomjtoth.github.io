pub(crate) mod runes;
pub(crate) mod spells;

use crate::components::audio::AudioSrc;
pub(crate) use runes::*;
pub(crate) use spells::*;

pub(crate) fn init_audio() -> Vec<AudioSrc> {
    let mut rvec = runes::init_audio();
    let mut svec = spells::init_audio();
    svec.append(&mut rvec);

    svec
}
