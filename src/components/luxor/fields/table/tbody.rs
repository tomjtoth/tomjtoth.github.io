use dioxus::prelude::*;

use crate::components::luxor::{fields::table::tr::TableRow, models::*};

#[derive(Props, PartialEq, Clone)]
pub(crate) struct TBodyProps {
    idx: usize,
}

#[component]
pub(crate) fn TableBody(props: TBodyProps) -> Element {
    let field = &FIELDS.get(props.idx).unwrap();

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
