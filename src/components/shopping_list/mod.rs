use dioxus::prelude::*;
use items::Items;
use models::RECIPES;

mod config;
mod controls;
mod items;
mod models;
mod recipes;
mod steps;

use crate::components::{body::Body, header::Header, loader::Loader};
use controls::Controls;
pub use models::init;
use recipes::Recipes;

#[component]
pub fn ShoppingList() -> Element {
    let uninitialized = RECIPES.len() == 0;

    use_future(move || async move {
        if uninitialized {
            init().await;
        }
    });

    rsx! {
        Header { title: "ostoslista", Controls {} }
        Body {
            if uninitialized {
                Loader {}
            } else {
                Recipes {}
                Items {}
            }
        }
    }
}
