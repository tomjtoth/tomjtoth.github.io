use super::Rune::*;
use crate::components::audio::{AudioOpt::*, AudioSrc};

pub(crate) fn init_audio() -> Vec<AudioSrc> {
    vec![
        (Aam, 0.2, 0.7),
        (Nhi, 0.15, 0.7),
        (Mega, 0.15, 1.0),
        (Yok, 0.2, 0.7),
        (Taar, 0.25, 0.9),
        (Kaom, 0.2, 1.05),
        (Vitae, 0.2, 1.0),
        (Vista, 0.3, 1.1),
        (Stregum, 0.1, 1.25),
        (Morte, 0.25, 1.2),
        (Cosum, 0.15, 1.2),
        (Comunicatum, 0.15, 1.65),
        (Movis, 0.3, 1.2),
        (Tempus, 0.3, 1.3),
        (Folgora, 0.15, 1.2),
        (Spacium, 0.3, 1.4),
        (Tera, 0.2, 1.0),
        (Cetrius, 0.15, 1.3),
        (Rhaa, 0.3, 0.9),
        (Fridd, 0.15, 1.5),
    ]
    .into_iter()
    .map(|(rune, start, next)| (rune.as_src(), vec![StartsAt(start), NextStartsAt(next)]))
    .collect()
}
