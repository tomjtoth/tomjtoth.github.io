use dioxus::prelude::*;

#[derive(Props, PartialEq, Clone)]
pub(crate) struct StepsProps {
    pub(crate) steps: Vec<String>,
    pub(crate) lang: Option<String>,
}

#[component]
pub(crate) fn Steps(props: StepsProps) -> Element {
    rsx! {
        ol {
            class: "slr-steps",
            lang: props.lang,
            onclick: |evt| {
                evt.stop_propagation();
            },
            {
                props
                    .steps
                    .iter()
                    .enumerate()
                    .map(move |(idx, step)| {
                        rsx! {
                            li { key: "{idx}", dangerous_inner_html: "{step}" }
                        }
                    })
            }
        }
    }
}
