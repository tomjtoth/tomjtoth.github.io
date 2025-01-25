use dioxus::prelude::*;

mod config;
mod controls;
mod items;
mod models;
mod recipes;
mod steps;

use crate::components::{body::Body, header::Header};
use controls::Controls;
pub use models::init;
use recipes::Recipes;

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
