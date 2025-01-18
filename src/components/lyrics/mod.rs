use crate::components::Header;
use dioxus::prelude::*;

#[component]
pub fn Lyrics() -> Element {
    rsx! {
        Header { title: &"Låttext", lang: Some("sv".to_string()) }
        "WiP"
    }
}
