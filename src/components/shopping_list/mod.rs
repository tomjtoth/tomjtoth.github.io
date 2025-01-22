use dioxus::prelude::*;
use models::{Active, Items};

mod controls;
mod items;
// mod logic;
mod config;
mod models;
mod recipes;
mod steps;

pub use models::*;
use recipes::Recipes;

use crate::{
    components::{Body, Header},
    utils::use_persistent,
};
use controls::Controls;

#[component]
pub fn ShoppingList() -> Element {
    let disk_items = use_persistent("sl-items", || Items::default());
    use_context_provider(|| disk_items);

    let disk_active = use_persistent("sl-active", || Active::default());
    use_context_provider(|| disk_active);

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
