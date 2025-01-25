use std::collections::HashMap;

use dioxus::{logger::tracing, signals::Signal};
use web_sys::HtmlAudioElement;

use crate::{components::modal::SOUND, utils::init_ctx};

type Sounds = HashMap<String, HtmlAudioElement>;

pub struct Audio(Sounds);
pub type AudioSrc = (&'static str, Option<f64>);
pub type SigAudio = Signal<Audio>;

impl Default for Audio {
    fn default() -> Self {
        tracing::debug!("Audio::default() called");

        let iterator = SOUND.iter().map(|(src, volume)| {
            let snd = HtmlAudioElement::new_with_src(src).unwrap();
            if let Some(vol) = volume {
                snd.set_volume(*vol);
            }
            (src.to_string(), snd)
        });

        Audio(HashMap::from_iter(iterator))
    }
}

impl Audio {
    pub fn play(&self, src: &'static str) {
        if let Some(snd) = self.0.get(src) {
            snd.set_current_time(0.0);
            let _res = snd.play();
        }
    }
}

pub fn init() {
    init_ctx(|| Audio::default());
}
