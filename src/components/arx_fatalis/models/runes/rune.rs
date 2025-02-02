use dioxus::logger::tracing;
use std::fmt;
use strum_macros::EnumIter;

use crate::components::audio::*;

#[derive(Copy, Clone, Debug, EnumIter, PartialEq)]
pub enum Rune {
    Aam,
    Nhi,
    Mega,
    Yok,
    Taar,
    Kaom,
    Vitae,
    Vista,
    Stregum,
    Morte,
    Cosum,
    Comunicatum,
    Movis,
    Tempus,
    Folgora,
    Spacium,
    Tera,
    Cetrius,
    Rhaa,
    Fridd,
}

impl fmt::Display for Rune {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Rune {
    pub fn as_src(&self) -> String {
        format!("/arx/runes/{}.mp3", self.to_string().to_lowercase())
    }

    pub fn play(&self) -> Option<u64> {
        tracing::debug!("attempting to play rune sound");
        AUDIO.play(&self.as_src())
    }
}
