use std::fmt;

use dioxus::logger::tracing;
use strum_macros::EnumIter;

use crate::{components::audio::*, utils::from_cache};

use super::{TrRunes, RUNES};

#[derive(Copy, Clone, Debug, EnumIter, PartialEq, Eq, Hash)]
pub(crate) enum Rune {
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
    pub(crate) fn src_mp3(&self) -> String {
        self.src(true)
    }

    pub(crate) fn src_png(&self) -> String {
        let url = self.src(false);
        if let Some(cached) = RUNES.get_png(self) {
            cached
        } else {
            url
        }
    }

    fn src(&self, mp3: bool) -> String {
        format!(
            "{}/arx/runes/{}.{}",
            if mp3 { "" } else { "/assets" },
            self.to_string().to_lowercase(),
            if mp3 { "mp3" } else { "png" }
        )
    }

    pub(crate) fn play(&self) -> Option<u64> {
        tracing::debug!("attempting to play rune sound");
        AUDIO.play(&self.src_mp3())
    }
}
