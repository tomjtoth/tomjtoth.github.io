use dioxus::prelude::*;

mod body;
mod cell;
mod head;
mod row;

use body::Body;
use head::Head;

#[derive(Props, PartialEq, Clone)]
pub struct TableProps {
    idx: usize,
}

#[component]
pub fn Table(props: TableProps) -> Element {
    rsx! {
        table {
            class: "luxor",
            Head {}
            Body { idx: props.idx }
        }
    }
}
