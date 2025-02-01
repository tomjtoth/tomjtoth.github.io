pub mod runes;
pub mod spells;

use crate::components::audio::AudioSrc;
pub use runes::CxRunes;
pub use spells::CxSpells;

pub fn init_audio() -> Vec<AudioSrc> {
    let mut rvec = runes::init_audio();
    let mut svec = spells::init_audio();
    svec.append(&mut rvec);

    svec
}
