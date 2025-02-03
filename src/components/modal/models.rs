use std::mem;

use dioxus::prelude::*;

use crate::components::audio::{AudioOpt, AudioSrc};

pub(super) type Cb = Callback<MouseEvent>;
pub(super) type OptCb = Option<Cb>;

#[derive(Debug, Hash, Eq, PartialEq, Clone, Copy)]
pub(crate) enum Language {
    Hu,
    Fi,
    En,
}

#[derive(Debug, Hash, Eq, PartialEq, Clone)]
pub(crate) enum Button {
    Ok,
    Cancel,
    Yes,
    No,
}

pub(crate) struct Modal {
    pub(crate) lang: Option<Language>,
    pub(crate) prompt: Option<Element>,
    pub(crate) buttons: Vec<(Button, OptCb)>,
}

impl Default for Modal {
    fn default() -> Self {
        Modal {
            lang: Some(Language::Fi),
            prompt: None,
            buttons: vec![(Button::Ok, None)],
        }
    }
}

impl Modal {
    // /// setter during build of new modal
    // pub(crate) fn lang(&mut self, lang: Language) -> &mut Self {
    //     self.lang = Some(lang);
    //     self
    // }

    /// setter during build of new modal
    pub(crate) fn buttons(&mut self, buttons: Vec<(Button, OptCb)>) -> &mut Self {
        self.buttons = buttons;
        self
    }

    /// finishing step of build
    pub(crate) fn prompt(&mut self, prompt: Element) {
        self.prompt = Some(prompt);
        let owned = mem::take(self);
        MODAL.with_mut(|w| mem::replace(w, owned));
    }
}

type GsModal = GlobalSignal<Modal>;
pub(crate) static MODAL: GsModal = GlobalSignal::new(|| Modal::default());

pub(crate) trait TrModal {
    fn lang(&self, lang: Language) -> Modal;
    fn buttons(&self, buttons: Vec<(Button, OptCb)>) -> Modal;
    // fn prompt(&self, prompt: Element);
    fn reset(&self);
}

impl TrModal for GsModal {
    fn reset(&self) {
        self.with_mut(|w| *w = Modal::default())
    }

    /// setter during build of new modal
    fn lang(&self, lang: Language) -> Modal {
        let mut m = Modal::default();
        m.lang = Some(lang);
        m
    }

    /// setter during build of new modal
    fn buttons(&self, buttons: Vec<(Button, OptCb)>) -> Modal {
        let mut m = Modal::default();
        m.buttons = buttons;
        m
    }

    // /// finishing step of build
    // fn prompt(&self, prompt: Element) {
    //     self.with_mut(|w| {
    //         let mut m = Modal::default();
    //         m.prompt = Some(prompt);
    //         *w = m;
    //     })
    // }
}

pub(crate) static SOUND: &'static str = "/modal.mp3";

pub(crate) fn init_audio() -> Vec<AudioSrc> {
    vec![(SOUND.to_string(), vec![AudioOpt::Volume(0.2)])]
}
