use dioxus::prelude::*;
use models::{spells::CastSpells, Queue};
use runes::Runes;

mod models;
mod runes;

use crate::{
    components::{body::Body, header::Header},
    utils::init_ctx,
};
pub use models::init_audio;

pub fn init() {
    init_ctx(|| CastSpells::init());
}

#[component]
pub fn ArxFatalis() -> Element {
    init_ctx(|| Queue::default());

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
