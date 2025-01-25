use dioxus::prelude::*;

use crate::components::header::Header;

#[component]
pub fn BatteryMonitor() -> Element {
    rsx! {
        Header { title: &"akunvalvonta" }
        "WiP"
    }
}
