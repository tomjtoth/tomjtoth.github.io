use std::collections::HashMap;

use dioxus::signals::Signal;
use web_sys::HtmlAudioElement;

type Sounds = HashMap<String, HtmlAudioElement>;

pub struct Audio {
    pub arx: Sounds,
    pub modal: HtmlAudioElement,
}

impl Default for Audio {
    fn default() -> Self {
        Audio {
            arx: HashMap::new(),
            modal: {
                let snd = HtmlAudioElement::new_with_src("/assets/modal.mp3").unwrap();
                snd.set_volume(0.2);
                snd
            },
        }
    }
}

pub type SigAudio = Signal<Audio>;
