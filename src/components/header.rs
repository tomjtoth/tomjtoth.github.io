use super::sidepanel::SpState;
use crate::Title;
use dioxus::prelude::*;

#[derive(PartialEq, Clone, Props)]
pub struct HeaderProps {
    lang: Option<String>,
    title: String,
    children: Option<Element>,
}

#[component]
pub fn Header(props: HeaderProps) -> Element {
    let mut sp_state = use_context::<SpState>();
    let mut title = use_context::<Title>();

    use_effect(move || {
        title.0.set(props.title.to_string());
    });

    rsx! {
        div {
            id: "header",
            class: "border1-s",
            lang: props.lang,

            span {
                id:"menu-button",
                class:"toggler clickable padded",
                onclick: move |_| sp_state.0.set(true),

                "☰"
            }

            {props.children}
        }

    }
}
