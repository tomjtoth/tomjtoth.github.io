use dioxus::prelude::*;

use crate::components::{body::Body, header::Header};

#[component]
pub fn Lyrics() -> Element {
    rsx! {
        Header { title: &"Låttext", lang: Some("sv".to_string()) }
        Body {
            "WiP"
        }
    }
}
