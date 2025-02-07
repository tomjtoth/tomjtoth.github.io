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
    pub(crate) silent: bool,
}

impl Default for Modal {
    fn default() -> Self {
        Modal {
            lang: Some(Language::Fi),
            prompt: None,
            buttons: vec![],
            silent: false,
        }
    }
}

#[allow(dead_code)]
impl Modal {
    /// setter during build of new modal
    pub fn silent(&mut self) -> &mut Self {
        self.silent = true;
        self
    }

    /// setter during build of new modal
    pub fn en(&mut self) -> &mut Self {
        self.lang = Some(Language::En);
        self
    }

    /// setter during build of new modal
    pub fn fi(&mut self) -> &mut Self {
        self.lang = Some(Language::Fi);
        self
    }

    /// setter during build of new modal
    pub fn hu(&mut self) -> &mut Self {
        self.lang = Some(Language::Hu);
        self
    }

    /// setter during build of new modal
    pub fn ok(&mut self, cb: OptCb) -> &mut Self {
        self.buttons.push((Button::Ok, cb));
        self
    }

    /// setter during build of new modal
    pub fn cancel(&mut self, cb: OptCb) -> &mut Self {
        self.buttons.push((Button::Cancel, cb));
        self
    }

    /// setter during build of new modal
    pub fn yes(&mut self, cb: OptCb) -> &mut Self {
        self.buttons.push((Button::Yes, cb));
        self
    }

    /// setter during build of new modal
    pub fn no(&mut self, cb: OptCb) -> &mut Self {
        self.buttons.push((Button::No, cb));
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

#[allow(dead_code)]
pub(crate) trait TrModal {
    fn en(&self) -> Modal;
    fn fi(&self) -> Modal;
    fn hu(&self) -> Modal;

    fn ok(&self, cb: OptCb) -> Modal;
    fn cancel(&self, cb: OptCb) -> Modal;
    fn yes(&self, cb: OptCb) -> Modal;
    fn no(&self, cb: OptCb) -> Modal;

    fn silent(&self) -> Modal;
    fn prompt(&self, prompt: Element);
    fn reset(&self);
}

impl TrModal for GsModal {
    /// setter during build of new modal
    fn en(&self) -> Modal {
        let mut m = Modal::default();
        m.lang = Some(Language::En);
        m
    }

    /// setter during build of new modal
    fn fi(&self) -> Modal {
        let mut m = Modal::default();
        m.lang = Some(Language::Fi);
        m
    }

    /// setter during build of new modal
    fn hu(&self) -> Modal {
        let mut m = Modal::default();
        m.lang = Some(Language::Hu);
        m
    }

    /// setter during build of new modal
    fn ok(&self, cb: OptCb) -> Modal {
        let mut m = Modal::default();
        m.buttons.push((Button::Ok, cb));
        m
    }

    /// setter during build of new modal
    fn cancel(&self, cb: OptCb) -> Modal {
        let mut m = Modal::default();
        m.buttons.push((Button::Cancel, cb));
        m
    }

    /// setter during build of new modal
    fn yes(&self, cb: OptCb) -> Modal {
        let mut m = Modal::default();
        m.buttons.push((Button::Yes, cb));
        m
    }

    /// setter during build of new modal
    fn no(&self, cb: OptCb) -> Modal {
        let mut m = Modal::default();
        m.buttons.push((Button::No, cb));
        m
    }

    /// setter during build of new modal
    fn silent(&self) -> Modal {
        let mut m = Modal::default();
        m.silent = true;
        m
    }

    /// finishing step of build
    fn prompt(&self, prompt: Element) {
        self.with_mut(|w| {
            let mut m = Modal::default();
            m.prompt = Some(prompt);
            *w = m;
        })
    }
    fn reset(&self) {
        self.with_mut(|w| *w = Modal::default())
    }
}

pub(crate) static SOUND: &'static str = "/modal.mp3";

pub(crate) fn init_audio() -> Vec<AudioSrc> {
    vec![(SOUND.to_string(), vec![AudioOpt::Volume(0.2)])]
}
