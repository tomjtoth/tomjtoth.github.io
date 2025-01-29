use std::fmt;
use strum_macros::EnumIter;

mod audio;
mod queue;

pub use audio::init_audio;
pub use queue::{Queue, SigQueue};

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
}
