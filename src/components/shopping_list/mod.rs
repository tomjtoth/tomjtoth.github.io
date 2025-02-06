use dioxus::prelude::*;

use crate::components::{body::Body, header::Header, loader::*};

mod config;
mod controls;
mod items;
mod models;
mod recipes;
mod steps;

use controls::Controls;
use items::Items;
use models::*;
use recipes::Recipes;

#[component]
pub(crate) fn ShoppingList() -> Element {
    let uninitialized = RECIPES.is_empty();

    use_effect(move || {
        if uninitialized {
            LOADER.show();
        }
    });

    use_future(move || async move {
        if uninitialized {
            RECIPES.init().await;
            LOADER.hide();
        }
    });

    rsx! {
        Header { title: "ostoslista", Controls {} }
        Body {
            if !uninitialized {
                Recipes {}
                Items {}
            }
        }
    }
}
