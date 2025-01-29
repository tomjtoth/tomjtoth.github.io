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
}

pub type AudioOpts = Vec<AudioOpt>;

struct Inner {
    mp3: HtmlAudioElement,
    starts_at: Option<f64>,
    next_starts_at: Option<f64>,
}

impl Default for Audio {
    fn default() -> Self {
        tracing::debug!("Audio::default() called");

        let mut all = arx_sounds();
        all.append(&mut modal_sounds());

        let iterator = all.iter().map(|(src, opts)| {
            let mp3 = HtmlAudioElement::new_with_src(&format!("/assets{src}")).unwrap();
            let mut starts_at = None;
            let mut next_starts_at = None;

            for opt in opts.iter() {
                match opt {
                    AudioOpt::Volume(volume) => mp3.set_volume(*volume),
                    AudioOpt::StartsAt(start) => starts_at = Some(*start),
                    AudioOpt::NextStartsAt(next) => next_starts_at = Some(*next),
                }
            }

            mp3.set_preload("auto");

            (
                src.to_string(),
                Inner {
                    mp3,
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

            snd.mp3.set_current_time(beginning);
            tracing::debug!("playing {src}");
            let _res = snd.mp3.play();

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
