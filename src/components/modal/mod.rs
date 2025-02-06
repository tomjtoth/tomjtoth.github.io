use dioxus::{logger::tracing, prelude::*};

use crate::{components::audio::*, routes::Route};

mod button;
mod models;

pub(crate) use models::*;

#[component]
pub(crate) fn ModalComponent() -> Element {
    let reset_state = use_callback(move |_| MODAL.reset());
    let m = MODAL.read();
    let prompt = &m.prompt;

    rsx! {
        if let Some(children) = prompt {
            div {
                class: "modal-blur",

                onclick: move |evt| {
                    tracing::debug!("div.modal-blur clicked");
                    reset_state.call(evt);
                },

                div {
                    class: "modal padded bordered",
                    lang: {
                        match m.lang {
                            Some(Language::En) => Some("en"),
                            Some(Language::Fi) => Some("fi"),
                            Some(Language::Hu) => Some("hu"),
                            _ => None,
                        }
                    },

                    onclick: |evt| {
                        evt.stop_propagation();
                    },

                    div { {children} }

                    div { id: "modal-buttons",

                        {
                            if !m.silent {
                                AUDIO.play(&SOUND.to_string());
                            }
                            let lang = if let Some(explicitly) = m.lang { explicitly } else { Language::Fi };
                            m.buttons
                                .iter()
                                .map(move |(btn, onclick)| {
                                    rsx! {
                                        button::Button {
                                            key: "{btn.clone() as usize}",
                                            lang,
                                            r#type: btn.clone(),
                                            onclick: *onclick,
                                            reset: reset_state,
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
