use dioxus::prelude::*;
use models::{spells::CastSpells, CxQueue};
use runes::Runes;

mod controls;
mod models;
mod runes;

use crate::{
    components::{body::Body, header::Header},
    utils::init_ctx,
};
use controls::Controls;
pub use models::init_audio;

pub fn init() {
    init_ctx(|| CastSpells::init());
}

#[component]
pub fn ArxFatalis() -> Element {
    CxQueue::init();

    rsx! {
        Header { title: "Arx Fatalis", Controls {} }
        Body { class: "arx-fatalis",

            div { id: "runes-spacer" }
            Runes {}
        }
    }
}
