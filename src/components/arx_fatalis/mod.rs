use dioxus::prelude::*;

use crate::components::{body::Body, header::Header};

mod controls;
mod models;
mod runes;

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
