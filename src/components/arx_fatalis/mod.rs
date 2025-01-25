use dioxus::prelude::*;

use crate::components::header::Header;

#[component]
pub fn ArxFatalis() -> Element {
    rsx! {
        Header { title: &"riimut" }
        "WiP"
    }
}
