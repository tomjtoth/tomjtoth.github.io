use dioxus::prelude::*;

use crate::components::luxor::fields::{table::cell::Cell, LuxorRow};

#[derive(Props, PartialEq, Clone)]
pub struct RowProps {
    field_idx: usize,
    idx: usize,
    row: LuxorRow,
}

#[component]
pub fn Row(props: RowProps) -> Element {
    let RowProps {
        field_idx,
        idx: row_idx,
        row,
    } = props;

    rsx! {
        tr {
            {row.iter().enumerate().map(move |(idx, num)| {
                rsx! {
                    Cell { field_idx, row_idx, idx, num: *num }
                }
            })}
        }
    }
}
