use std::collections::HashMap;

use dioxus::{logger::tracing, prelude::*};
use web_sys::HtmlAudioElement;

mod opts;
pub use opts::*;
use AudioOpt::*;

use crate::components::{arx_fatalis::init_audio as arx_sounds, modal::init_audio as modal_sounds};

#[derive(Clone)]
pub struct Audio {
    src: Option<HtmlAudioElement>,
    starts_at: Option<f64>,
    next_starts_at: Option<f64>,
}

type GsAudio = GlobalSignal<HashMap<String, Audio>>;

pub trait TrAudio {
    fn play(&self, src: &String) -> Option<u64>;
}

impl TrAudio for GsAudio {
    fn play(&self, src: &String) -> Option<u64> {
        let mut beginning = 0.0;
        let mut ret_val = None;

        if let Some(snd) = self.read().get(src) {
            if let Some(val) = snd.starts_at {
                beginning = val;
            }

            if let Some(audio) = &snd.src {
                audio.set_current_time(beginning);
                tracing::debug!("playing {src}");
                let _res = audio.play();
            } else {
                tracing::error!("{src} is not available in static assets");
            }

            if let Some(val) = snd.next_starts_at {
                ret_val = Some(((val - beginning) * 1000.0) as u64)
            }
        } else {
            tracing::error!("{src} is not loaded into the Audio component");
        }

        ret_val
    }
}

pub static AUDIO: GsAudio = Signal::global(|| {
    tracing::debug!("Audio::default() called");

    let mut all = arx_sounds();
    all.append(&mut modal_sounds());

    let iterator = all.into_iter().map(|(path, opts)| {
        let mut src = None;
        let mut src_available = true;
        let mut volume = None;
        let mut starts_at = None;
        let mut next_starts_at = None;

        for opt in opts.iter() {
            match opt {
                Volume(vol) => volume = Some(*vol),
                StartsAt(start) => starts_at = Some(*start),
                NextStartsAt(next) => next_starts_at = Some(*next),
                NotAvailable => src_available = false,
            }
        }

        if src_available {
            let audio = HtmlAudioElement::new_with_src(&format!("/assets{path}")).unwrap();
            audio.set_preload("auto");
            if let Some(vol) = volume {
                audio.set_volume(vol);
            }
            src = Some(audio);
        }

        (
            path.to_string(),
            Audio {
                src,
                starts_at,
                next_starts_at,
            },
        )
    });

    HashMap::from_iter(iterator)
});
