use dioxus::prelude::*;

mod controls;
mod items;
// mod logic;
mod config;
mod models;
mod recipes;
mod steps;

pub use models::*;
use models::{Active, Items};
use recipes::Recipes;

use crate::components::{Body, Header};
use controls::Controls;

#[component]
pub fn ShoppingList() -> Element {
    let items = use_signal(|| Items::init());
    use_context_provider(|| items);

    let active = use_signal(|| Active::init());
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
