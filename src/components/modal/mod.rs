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

    rsx! {
        if let ModalState {
            lang,
            prompt: Some(children),
            buttons
        } = state() {
            div {
                id: "modal-blur",

                onclick: move |_| {
                    tracing::debug!("hiding modal");
                    // if let Some(xx_) = buttons.iter().position(|(_btn, cb)| {cb.is_some()}) {
                        // state.write().prompt = None;
                    // } else {
                        state.set(ModalState::default())
                    // }
                },

            // audio {
            //     src: "/public/modal.mp3",
            // }

                div {
                    id: "modal",
                    class: "padded bordered",
                    // onclick: |evt| {
                    //     // only stopping clicks within the messagebox,
                    //     // but not the buttons
                    //     evt.stop_propagation();
                    // },

                    {children}

                    div {
                        id: "modal-buttons",

                        {
                            let lang = if let Some(explicitly) = lang {
                                explicitly
                            } else {
                                Language::Fi
                            };

                            buttons.iter().map(move |(btn, ev_handler)| {
                                let clone = btn.clone();
                                rsx! {
                                    Btn {
                                        key: {clone as usize},
                                        cfg: (lang, clone, *ev_handler)
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
