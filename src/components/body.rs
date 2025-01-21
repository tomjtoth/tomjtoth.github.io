use dioxus::prelude::*;

#[derive(PartialEq, Clone, Props)]
pub struct BodyProps {
    class: Option<String>,
    style: Option<String>,
    lang: Option<String>,
    children: Element,
}

/// Main view
#[component]
pub fn Body(props: BodyProps) -> Element {
    rsx! {
        div {
            id: "body",
            lang: props.lang,
            class: props.class,
            style: props.style,

            {props.children}
        }
    }
}
