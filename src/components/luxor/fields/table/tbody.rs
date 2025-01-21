use dioxus::prelude::*;

use crate::components::luxor::{fields::table::tr::TableRow, DiskLuxorFields};

#[derive(Props, PartialEq, Clone)]
pub struct TBodyProps {
    idx: usize,
}

#[component]
pub fn TableBody(props: TBodyProps) -> Element {
    let disk_fields = use_context::<DiskLuxorFields>();
    let field = disk_fields.get().0[props.idx];

    rsx! {
        tbody {
            {field.rows.iter().enumerate().map( |(idx, row)| {
                rsx!{
                    TableRow {
                        key: "{idx}", // order never changes
                        field_idx: props.idx,
                        idx,
                        row: *row,
                    }
                }
            })}
        }
    }
}
