use super::sidepanel::SpState;
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

    rsx! {
        document::Title { "{props.title}" }
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
