use dioxus::prelude::*;

mod controls;
mod items;
// mod logic;
mod config;
pub mod models;
mod recipes;
mod steps;

use recipes::Recipes;

use crate::components::{Body, Header};
use controls::Controls;

#[component]
pub fn ShoppingList() -> Element {
    let items = use_signal(|| models::Items::init());
    use_context_provider(|| items);

    let active = use_signal(|| models::Active::init());
    use_context_provider(|| active);

    rsx! {
        Header {
            title: &"ostoslista",
            Controls {}
        }
        Body {
            Recipes {}
        }
    }
}
