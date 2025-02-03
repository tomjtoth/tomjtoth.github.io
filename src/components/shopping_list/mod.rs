use dioxus::prelude::*;

mod config;
mod controls;
mod items;
mod models;
mod recipes;
mod steps;

use crate::components::{body::Body, header::Header, loader::Loader};
use controls::Controls;
use items::Items;
use models::*;
use recipes::Recipes;

#[component]
pub(crate) fn ShoppingList() -> Element {
    let uninitialized = RECIPES.len() == 0;

    use_future(move || async move {
        if uninitialized {
            RECIPES.init().await;
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
