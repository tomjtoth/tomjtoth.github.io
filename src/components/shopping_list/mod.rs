use crate::components::Header;
use dioxus::prelude::*;

#[component]
pub fn ShoppingList() -> Element {
    rsx! {
        Header { title: &"ostoslista" }
        "WiP"
    }
}
