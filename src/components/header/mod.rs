use dioxus::prelude::*;

use crate::components::sidepanel::*;

#[derive(PartialEq, Clone, Props)]
pub(crate) struct HeaderProps {
    lang: Option<String>,
    title: String,
    children: Option<Element>,
}

#[component]
pub(crate) fn Header(props: HeaderProps) -> Element {
    rsx! {
        document::Title { "{props.title}" }
        div { id: "header", class: "border1-s", lang: props.lang,
            span {
                id: "menu-button",
                class: "toggler clickable padded",
                onclick: move |_| SIDEPANEL.show(),
                "☰"
            }
            {props.children}
        }
    }
}
