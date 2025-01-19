use button::{Btn, Button, Language};
use dioxus::prelude::*;

use crate::routes::Route;
mod button;

type OptCb = Option<Callback<MouseEvent>>;

#[derive(Clone, PartialEq)]
pub struct ModalState {
    lang: Option<Language>,
    children: Element,
    buttons: Vec<Button>,
    on_success: OptCb,
    on_failure: OptCb,
}

type ModalType = Option<ModalState>;

#[component]
pub fn Modal() -> Element {
    let mut state = use_signal::<ModalType>(|| None);
    use_context_provider(|| state);

    if let Some(props) = state.take() {
        let mut success_unassigned = true;
        let mut failure_unassigned = true;

        let lang = if let Some(lang) = props.lang {
            lang
        } else {
            Language::Fi
        };

        rsx! {
            div {
                id: "modal-blur",
                onclick: move |_| {
                    state.set(None)
                },
                div {
                    id: "modal",
                    class: "padded bordered",

                    {props.children}

                    {props.buttons.iter().map(|btn| {
                        let mut onclick = None;

                        if success_unassigned && (
                            btn == &Button::Ok ||
                            btn == &Button::Yes
                        ) {
                            onclick = props.on_success;
                            success_unassigned = false;
                        }

                        if failure_unassigned && (
                            btn == &Button::Cancel ||
                            btn == &Button::No
                        ) {
                            onclick = props.on_failure;
                            failure_unassigned = false;
                        }

                        rsx!{
                            Btn { cfg: (lang, btn.clone(), onclick) }
                        }
                    })}
                }
            }

            Outlet::<Route> {}
        }
    } else {
        rsx! { Outlet::<Route> {} }
    }
}
