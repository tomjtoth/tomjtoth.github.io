use dioxus::prelude::*;

use crate::components::luxor::{fields::table::td::TableData, models::LuxorRow};

#[derive(Props, PartialEq, Clone)]
pub struct TRProps {
    field_idx: usize,
    idx: usize,
    row: LuxorRow,
}

#[component]
pub fn TableRow(props: TRProps) -> Element {
    let TRProps {
        field_idx,
        idx: row_idx,
        row,
    } = props;

    rsx! {
        tr {
            {
                row.iter()
                    .enumerate()
                    .map(move |(idx, num)| {
                        rsx! {
                            TableData {
                                field_idx,
                                row_idx,
                                idx,
                                num: *num,
                            }
                        }
                    })
            }
        }
    }
}
