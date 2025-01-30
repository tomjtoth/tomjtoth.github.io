use std::collections::HashMap;

use dioxus::{logger::tracing, signals::Signal};
use web_sys::HtmlAudioElement;

use crate::{
    components::{arx_fatalis::init_audio as arx_sounds, modal::init_sound as modal_sounds},
    utils::init_ctx,
};

type Sounds = HashMap<String, Inner>;

pub struct Audio(Sounds);
pub type SigAudio = Signal<Audio>;
pub type AudioSrc = (String, AudioOpts);

pub enum AudioOpt {
    Volume(f64),
    StartsAt(f64),
    NextStartsAt(f64),
    NotAvailable,
}

pub type AudioOpts = Vec<AudioOpt>;

struct Inner {
    src: Option<HtmlAudioElement>,
    starts_at: Option<f64>,
    next_starts_at: Option<f64>,
}

impl Default for Audio {
    fn default() -> Self {
        tracing::debug!("Audio::default() called");

        let mut all = arx_sounds();
        all.append(&mut modal_sounds());

        let iterator = all.iter().map(|(path, opts)| {
            let mut src = None;
            let mut src_available = true;
            let mut volume = None;
            let mut starts_at = None;
            let mut next_starts_at = None;

            for opt in opts.iter() {
                match opt {
                    AudioOpt::Volume(vol) => volume = Some(*vol),
                    AudioOpt::StartsAt(start) => starts_at = Some(*start),
                    AudioOpt::NextStartsAt(next) => next_starts_at = Some(*next),
                    AudioOpt::NotAvailable => src_available = false,
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
                Inner {
                    src,
                    starts_at,
                    next_starts_at,
                },
            )
        });

        Audio(HashMap::from_iter(iterator))
    }
}

impl Audio {
    pub fn play(&self, src: &String) -> Option<u64> {
        let mut beginning = 0.0;
        let mut ret_val = None;

        if let Some(snd) = self.0.get(src) {
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

pub fn init() {
    init_ctx(|| Audio::default());
}
