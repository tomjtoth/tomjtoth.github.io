use dioxus::{logger::tracing, prelude::*};

mod button;

use super::audio::{AudioOpt, AudioSrc};
use crate::{components::audio::SigAudio, routes::Route, utils::init_ctx};
use button::Btn;
pub use button::{Button, Language};

type Cb = Callback<MouseEvent>;
type OptCb = Option<Cb>;

#[derive(Clone, PartialEq)]
pub struct ModalState {
    pub lang: Option<Language>,
    pub prompt: Option<Element>,
    pub buttons: Vec<(Button, OptCb)>,
}

pub type SigModal = Signal<ModalState>;

impl Default for ModalState {
    fn default() -> Self {
        ModalState {
            lang: Some(Language::Fi),
            prompt: None,
            buttons: vec![(Button::Ok, None)],
        }
    }
}

impl ModalState {
    fn reset(&mut self) {
        *self = Self::default();
    }
}

static SOUND: &'static str = "/modal.mp3";
pub fn init_sound() -> Vec<AudioSrc> {
    vec![(SOUND.to_string(), vec![AudioOpt::Volume(0.2)])]
}

#[component]
pub fn Modal() -> Element {
    let mut state = init_ctx(|| ModalState::default());
    let audio = use_context::<SigAudio>();

    let reset_state = use_callback(move |_| state.write().reset());

    rsx! {
        if let ModalState {
            lang,
            prompt: Some(children),
            buttons
        } = state() {
            div {
                id: "modal-blur",

                onclick: move |evt| {
                    tracing::debug!("div#modal-blur clicked");
                    reset_state.call(evt);
                },

                div {
                    id: "modal",
                    class: "padded bordered",
                    lang: {
                        match lang {
                            Some(Language::En) => Some("en"),
                            Some(Language::Fi) => Some("fi"),
                            Some(Language::Hu) => Some("hu"),
                            _ => None
                        }
                    },

                    onclick: |evt| {
                        // the messagebox itself should persist if clicked
                        evt.stop_propagation();
                    },

                    div {
                        {children}
                    }

                    div {
                        id: "modal-buttons",

                        {
                            audio.read().play(&SOUND.to_string());

                            let lang = if let Some(explicitly) = lang {
                                explicitly
                            } else {
                                Language::Fi
                            };

                            buttons.iter().map(move |(btn, onclick)| {
                                rsx! {
                                    Btn {
                                        key: "{btn.clone() as usize}",
                                        lang,
                                        r#type: btn.clone(),
                                        onclick: *onclick,
                                        reset: reset_state
                                    }
                                }
                            })
                        }
                    }
                }
            }

        }

        Outlet::<Route> {}
    }
}
