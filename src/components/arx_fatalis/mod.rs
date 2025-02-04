use dioxus::prelude::*;

mod controls;
mod models;
mod runes;

use crate::components::{body::Body, header::Header};
use controls::Controls;
pub(crate) use models::init_audio;
use runes::Runes;

#[component]
pub(crate) fn ArxFatalis() -> Element {
    rsx! {
        Header { title: "Arx Fatalis", Controls {} }
        Body { class: "arx-fatalis",

            div { id: "runes-spacer" }
            Runes {}
        }
    }
}
