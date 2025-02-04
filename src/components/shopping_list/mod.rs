use dioxus::prelude::*;

mod config;
mod controls;
mod items;
mod models;
mod recipes;
mod steps;

use crate::components::{body::Body, header::Header, loader::*};
use controls::Controls;
use items::Items;
use models::*;
use recipes::Recipes;

#[component]
pub(crate) fn ShoppingList() -> Element {
    let uninitialized = RECIPES.is_empty();

    if uninitialized {
        LOADER.show();
    }

    use_future(move || async move {
        if uninitialized {
            RECIPES.init().await;
            LOADER.hide().await;
        }
    });

    rsx! {
        Header { title: "ostoslista", Controls {} }
        Body {
            Recipes {}
            if !uninitialized {
                Items {}
            }
        }
    }
}
