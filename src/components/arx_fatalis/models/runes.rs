use std::fmt;
use strum_macros::EnumIter;

use crate::components::audio::{AudioOpt::*, AudioSrc};

#[derive(Debug, EnumIter)]
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

pub fn init_audio() -> Vec<AudioSrc> {
    vec![
        (Rune::Aam, [0.2, 0.7]),
        (Rune::Nhi, [0.15, 0.7]),
        (Rune::Mega, [0.15, 1.0]),
        (Rune::Yok, [0.2, 0.7]),
        (Rune::Taar, [0.25, 0.9]),
        (Rune::Kaom, [0.2, 1.05]),
        (Rune::Vitae, [0.2, 1.0]),
        (Rune::Vista, [0.3, 1.1]),
        (Rune::Stregum, [0.1, 1.25]),
        (Rune::Morte, [0.25, 1.2]),
        (Rune::Cosum, [0.15, 1.2]),
        (Rune::Comunicatum, [0.15, 1.65]),
        (Rune::Movis, [0.3, 1.2]),
        (Rune::Tempus, [0.3, 1.3]),
        (Rune::Folgora, [0.15, 1.2]),
        (Rune::Spacium, [0.3, 1.4]),
        (Rune::Tera, [0.2, 1.0]),
        (Rune::Cetrius, [0.15, 1.3]),
        (Rune::Rhaa, [0.3, 0.9]),
        (Rune::Fridd, [0.15, 1.5]),
    ]
    .into_iter()
    .map(|(rune, [start, next])| (rune.as_src(), vec![StartsAt(start), NextStartsAt(next)]))
    .collect()
}
