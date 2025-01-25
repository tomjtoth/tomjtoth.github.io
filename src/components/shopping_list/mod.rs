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
