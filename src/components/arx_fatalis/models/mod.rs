pub mod runes;
pub mod spells;

use crate::components::audio::AudioSrc;
pub use runes::{Queue, SigQueue};
pub use spells::SigCastSpells;

pub fn init_audio() -> Vec<AudioSrc> {
    let mut rvec = runes::init_audio();
    let mut svec = spells::init_audio();
    svec.append(&mut rvec);

    svec
}
