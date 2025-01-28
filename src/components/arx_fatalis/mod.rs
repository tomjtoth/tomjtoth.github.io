use dioxus::prelude::*;

mod models;
mod runes;

use crate::components::{body::Body, header::Header};
pub use models::runes::init_audio;
use runes::Runes;

pub fn init() {}

#[component]
pub fn ArxFatalis() -> Element {
    rsx! {
        Header {
            title: &"Arx Fatalis",
            // Controls {}
        }
        Body {
            class: "arx-fatalis",

            div { id: "runes-spacer" }
            Runes {}
        }
    }
}
