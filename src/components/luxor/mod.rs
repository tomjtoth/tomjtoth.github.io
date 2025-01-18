use crate::components::Header;
use dioxus::prelude::*;

#[component]
pub fn Luxor() -> Element {
    rsx! {
        Header { title: &"Luxor" }
        "WiP"
    }
}
