use dioxus::prelude::*;

mod tbody;
mod td;
mod tr;

use tbody::TableBody;

#[derive(Props, PartialEq, Clone)]
pub(crate) struct TableProps {
    idx: usize,
}

#[component]
pub(crate) fn Table(props: TableProps) -> Element {
    rsx! {
        table { class: "luxor",
            thead {
                tr {
                    {
                        "LUXOR"
                            .chars()
                            .map(|char| {
                                rsx! {
                                    th { class: "luxor", "{char}" }
                                }
                            })
                    }
                }
            }
            TableBody { idx: props.idx }
        }
    }
}
