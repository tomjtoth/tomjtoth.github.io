use dioxus::{logger::tracing, prelude::*};

mod button;
mod models;

use crate::{components::audio::*, routes::Route};
pub use models::*;

#[component]
pub fn ModalComponent() -> Element {
    let reset_state = use_callback(move |_| MODAL.reset());
    let r = MODAL.read();
    let prompt = &r.prompt;

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
                        match r.lang {
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
                            AUDIO.play(&SOUND.to_string());
                            let lang = if let Some(explicitly) = r.lang { explicitly } else { Language::Fi };
                            r.buttons
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
