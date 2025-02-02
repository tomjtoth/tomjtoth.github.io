use std::mem;

use dioxus::prelude::*;

use crate::components::audio::{AudioOpt, AudioSrc};

use super::{
    Button::{self, *},
    Language::{self, *},
};

pub(super) type Cb = Callback<MouseEvent>;
pub(super) type OptCb = Option<Cb>;

pub struct Modal {
    pub lang: Option<Language>,
    pub prompt: Option<Element>,
    pub buttons: Vec<(Button, OptCb)>,
}

impl Default for Modal {
    fn default() -> Self {
        Modal {
            lang: Some(Fi),
            prompt: None,
            buttons: vec![(Ok, None)],
        }
    }
}

impl Modal {
    pub fn lang(&mut self, lang: Language) -> &mut Self {
        self.lang = Some(lang);
        self
    }

    pub fn buttons(&mut self, buttons: Vec<(Button, OptCb)>) -> &mut Self {
        self.buttons = buttons;
        self
    }

    pub fn prompt(&mut self, prompt: Element) {
        self.prompt = Some(prompt);
        let owned = mem::take(self);
        MODAL.with_mut(|w| mem::replace(w, owned));
    }
}

type GsModal = GlobalSignal<Modal>;
pub static MODAL: GsModal = GlobalSignal::new(|| Modal::default());

pub trait TrModal {
    fn lang(&self, lang: Language) -> Modal;
    fn buttons(&self, buttons: Vec<(Button, OptCb)>) -> Modal;
    fn prompt(&self, prompt: Element);
    fn reset(&self);
}

impl TrModal for GsModal {
    fn reset(&self) {
        self.with_mut(|w| *w = Modal::default())
    }

    fn lang(&self, lang: Language) -> Modal {
        let mut m = Modal::default();
        m.lang = Some(lang);
        m
    }

    fn buttons(&self, buttons: Vec<(Button, OptCb)>) -> Modal {
        let mut m = Modal::default();
        m.buttons = buttons;
        m
    }

    fn prompt(&self, prompt: Element) {
        self.with_mut(|w| w.prompt = Some(prompt));
    }
}

pub static SOUND: &'static str = "/modal.mp3";

pub fn init_audio() -> Vec<AudioSrc> {
    vec![(SOUND.to_string(), vec![AudioOpt::Volume(0.2)])]
}
