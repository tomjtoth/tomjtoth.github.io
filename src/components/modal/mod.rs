use crate::routes::Route;
pub use button::*;
use dioxus::{logger::tracing, prelude::*};

mod button;

#[derive(Clone, PartialEq)]
pub struct ModalState {
    pub lang: Option<Language>,
    pub children: Element,
    pub buttons: Vec<(Button, OptionalHandler)>,
}

pub type ModalType = Option<ModalState>;

#[component]
pub fn Modal() -> Element {
    let mut state = use_signal::<ModalType>(|| None);
    use_context_provider(|| state);

    if let Some(props) = state.cloned() {
        let lang = if let Some(lang) = props.lang {
            lang
        } else {
            Language::Fi
        };

        rsx! {
            div {
                id: "modal-blur",

                onclick: move |_| {
                    tracing::debug!("hiding modal");
                    state.replace(None);
                },

                // audio {
                //     src: "/public/modal.mp3",
                // }

                div {
                    id: "modal",
                    class: "padded bordered",
                    // onclick: |evt| {
                    //     evt.stop_propagation();
                    // },

                    {props.children}

                    div {
                        id: "modal-buttons",

                        {props.buttons.iter().map(|(btn, ev_handler)| {

                            rsx! {
                                Btn {
                                    key: {btn.clone() as usize},
                                    cfg: (lang, btn.clone(), *ev_handler)
                                }
                            }
                        })}
                    }
                }
            }
            Outlet::<Route> {}
        }
    } else {
        rsx! { Outlet::<Route> {} }
    }
}
