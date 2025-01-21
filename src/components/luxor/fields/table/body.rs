use dioxus::prelude::*;

use crate::components::luxor::{fields::table::row::Row, DiskLuxorFields};

#[derive(Props, PartialEq, Clone)]
pub struct BodyProps {
    idx: usize,
}

#[component]
pub fn Body(props: BodyProps) -> Element {
    let disk_fields = use_context::<DiskLuxorFields>();
    let field = disk_fields.get().0[props.idx];
    let rows = field.rows;

    rsx! {
        tbody {
            {rows.iter().enumerate().map( |(idx, row)| {
                rsx!{
                    Row {
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
