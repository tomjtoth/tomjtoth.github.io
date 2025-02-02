use dioxus::{logger::tracing, prelude::*};

mod button;
mod models;

use crate::{components::audio::*, routes::Route};
use button::Btn;
pub use button::{Button, Language};
pub use models::*;

#[component]
pub fn ModalComponent() -> Element {
    let modal = use_context::<CxModal>();

    let reset_state = use_callback({
        let mut modal = modal.clone();
        move |_| modal.reset()
    });

    rsx! {
        if let Modal { lang, prompt: Some(children), buttons } = modal.get() {
            div {
                class: "modal-blur",

                onclick: move |evt| {
                    tracing::debug!("div.modal-blur clicked");
                    reset_state.call(evt);
                },

                div {
                    class: "modal padded bordered",
                    lang: {
                        match lang {
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
                            let lang = if let Some(explicitly) = lang { explicitly } else { Language::Fi };
                            buttons
                                .iter()
                                .map(move |(btn, onclick)| {
                                    rsx! {
                                        Btn {
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
