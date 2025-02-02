use std::mem;

use dioxus::prelude::*;

use crate::components::audio::{AudioOpt, AudioSrc};

use super::{
    Button::{self, *},
    Language::{self, *},
};

pub type Cb = Callback<MouseEvent>;
pub type OptCb = Option<Cb>;

#[derive(Clone, PartialEq)]
pub(super) struct Modal {
    pub(super) lang: Option<Language>,
    pub(super) prompt: Option<Element>,
    pub(super) buttons: Vec<(Button, OptCb)>,
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

#[derive(Clone)]
pub struct CxModal {
    inner: Signal<Modal>,
    buffer: Modal,
}

pub(crate) fn init() {
    CxModal::init();
}

impl CxModal {
    pub(crate) fn init() {
        let inner = use_signal(|| Modal::default());
        let modal = Self {
            inner,
            buffer: Modal::default(),
        };
        use_context_provider(|| modal);
    }

    pub(super) fn reset(&mut self) {
        self.inner.set(Modal::default());
    }

    pub(super) fn get(&self) -> Modal {
        self.inner.read().clone()
    }

    pub(crate) fn lang(&mut self, lang: Language) -> &mut Self {
        self.buffer.lang = Some(lang);
        self
    }

    pub fn buttons(&mut self, buttons: Vec<(Button, OptCb)>) -> &mut Self {
        self.buffer.buttons = buttons;
        self
    }

    pub fn prompt(&mut self, prompt: Element) {
        self.buffer.prompt = Some(prompt);
        let buffer = mem::replace(&mut self.buffer, Modal::default());
        self.inner.set(buffer);
    }
}

pub static SOUND: &'static str = "/modal.mp3";

pub fn init_sound() -> Vec<AudioSrc> {
    vec![(SOUND.to_string(), vec![AudioOpt::Volume(0.2)])]
}
