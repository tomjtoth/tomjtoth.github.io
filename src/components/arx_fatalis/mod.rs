use crate::components::Header;
use dioxus::prelude::*;

#[component]
pub fn ArxFatalis() -> Element {
    rsx! {
        Header { title: &"riimut" }
        "WiP"
    }
}
