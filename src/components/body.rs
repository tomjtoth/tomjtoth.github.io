use dioxus::prelude::*;

#[derive(PartialEq, Clone, Props)]
pub(crate) struct BodyProps {
    class: Option<String>,
    style: Option<String>,
    lang: Option<String>,
    children: Element,
}

/// Main view
#[component]
pub(crate) fn Body(props: BodyProps) -> Element {
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
