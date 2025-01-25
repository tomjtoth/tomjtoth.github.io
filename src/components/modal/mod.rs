use dioxus::{logger::tracing, prelude::*};

mod button;

use crate::{components::audio::model::SigAudio, routes::Route};
use button::Btn;
pub use button::{Button, Language};

use super::audio::model::AudioSrc;

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

pub static SOUND: [AudioSrc; 1] = [("/assets/modal.mp3", Some(0.2))];

#[component]
pub fn Modal() -> Element {
    let mut state = use_signal(|| ModalState::default());
    use_context_provider(|| state);
    let audio = use_context::<SigAudio>();

    let reset = use_callback(move |_| state.set(ModalState::default()));

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
                    reset.call(evt);
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
                            tracing::debug!("playing modal sound");
                            audio.read().play(SOUND[0].0);

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
                                        reset
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
