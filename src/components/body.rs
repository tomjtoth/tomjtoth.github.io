use dioxus::prelude::*;

#[derive(PartialEq, Clone, Props)]
pub struct BodyProps {
    class: Option<String>,
    style: Option<String>,
    content: Element,
}

/// Main view
#[component]
pub fn Body(props: BodyProps) -> Element {
    rsx! {
        div {
            id: "body",
            class: props.class,
            style: props.style,

            {props.content}
        }
    }
}
