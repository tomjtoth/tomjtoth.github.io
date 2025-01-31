use dioxus::prelude::*;

use crate::components::luxor::{fields::table::tr::TableRow, models::CxFields};

#[derive(Props, PartialEq, Clone)]
pub struct TBodyProps {
    idx: usize,
}

#[component]
pub fn TableBody(props: TBodyProps) -> Element {
    let fields = use_context::<CxFields>();
    let field = fields.get(props.idx).unwrap().to_owned();

    rsx! {
        tbody {
            {
                field
                    .rows
                    .iter()
                    .enumerate()
                    .map(|(idx, row)| {
                        rsx! {
                            TableRow {
                                key: "{idx}", // order never changes
                                field_idx: props.idx,
                                idx,
                                row: *row,
                            }
                        }
                    })
            }
        }
    }
}
