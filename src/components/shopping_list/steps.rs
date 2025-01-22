use dioxus::{logger::tracing, prelude::*};

#[derive(Props, PartialEq, Clone)]
pub struct StepsProps {
    pub steps: Vec<String>,
    pub lang: Option<String>,
}

#[component]
pub fn Steps(props: StepsProps) -> Element {
    rsx! {
        ol {
            class: "slr-steps",
            lang: props.lang,
            onclick: |evt| { evt.stop_propagation(); },
            {props.steps.iter().enumerate().map(move |(idx, step)| {
                rsx!{
                    li {
                        key: "{idx}",
                        dangerous_inner_html: "{step}"
                    }
                }
            })}
        }
    }
}
