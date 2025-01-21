mod button;

use crate::routes::Route;
use button::Btn;
pub use button::{Button, Language};
use dioxus::{logger::tracing, prelude::*};

type Cb = Callback<MouseEvent>;
type OptCb = Option<Cb>;

#[derive(Clone, PartialEq)]
pub struct ModalState {
    pub lang: Option<Language>,
    pub prompt: Option<Element>,
    pub buttons: Vec<(Button, OptCb)>,
}

pub type SigModalState = Signal<ModalState>;

impl Default for ModalState {
    fn default() -> Self {
        ModalState {
            lang: Some(Language::Fi),
            prompt: None,
            buttons: vec![(Button::Ok, None)],
        }
    }
}

#[component]
pub fn Modal() -> Element {
    let mut state = use_signal(|| ModalState::default());
    use_context_provider(|| state);

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

            // audio {
            //     src: "/public/modal.mp3",
            // }

                div {
                    id: "modal",
                    class: "padded bordered",
                    onclick: |evt| {
                        // the messagebox itself should persist if clicked
                        evt.stop_propagation();
                    },

                    p {
                        {children}
                    }

                    div {
                        id: "modal-buttons",

                        {
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
