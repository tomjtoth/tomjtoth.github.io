use crate::routes::Route;
pub use button::*;
use dioxus::{logger::tracing, prelude::*};
mod button;

pub type EventHandler = Callback<MouseEvent>;
pub type OptionalHandler = Option<EventHandler>;

#[derive(Props, Clone, PartialEq)]
pub struct ModalProps {
    pub lang: Option<Language>,
    pub children: Element,
    pub buttons: Vec<(Button, OptionalHandler)>,
    pub cancel: EventHandler,
}

pub type ModalType = Option<ModalProps>;

#[component]
pub fn Modal(props: ModalProps) -> Element {
    let lang = if let Some(lang) = props.lang {
        lang
    } else {
        Language::Fi
    };

    rsx! {
        div {
            id: "modal-blur",

            onclick: move |evt| {
                tracing::debug!("canceling modal");
                props.cancel.call(evt);
            },

            // audio {
            //     src: "/public/modal.mp3",
            // }

            div {
                id: "modal",
                class: "padded bordered",

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
}
