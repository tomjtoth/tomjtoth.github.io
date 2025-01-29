use dioxus::prelude::*;

use crate::components::arx_fatalis::models::SigCastSpells;

#[component]
pub fn Controls() -> Element {
    let spells = use_context::<SigCastSpells>();

    rsx! {}
}
