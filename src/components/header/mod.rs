use dioxus::prelude::*;

use crate::components::sidepanel::SigSidepanel;

#[derive(PartialEq, Clone, Props)]
pub struct HeaderProps {
    lang: Option<String>,
    title: String,
    children: Option<Element>,
}

#[component]
pub fn Header(props: HeaderProps) -> Element {
    let mut sidepanel = use_context::<SigSidepanel>();

    rsx! {
        document::Title { "{props.title}" }
        div { id: "header", class: "border1-s", lang: props.lang,

            span {
                id: "menu-button",
                class: "toggler clickable padded",
                onclick: move |_| sidepanel.write().set(true),

                "☰"
            }

            {props.children}
        }
    }
}
