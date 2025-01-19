use crate::{
    components::{Body, Header},
    utils::{use_persistent, UsePersistent},
};
use controls::Controls;
use dioxus::prelude::*;
use serde::{Deserialize, Serialize};
mod controls;
mod nums_line;

#[derive(Serialize, Deserialize, Clone)]
struct Field {
    id: usize,
    order: usize,
    numbers: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone)]
struct LuxorState {
    numbers: Vec<u8>,
    fields: Vec<Field>,
}

impl Default for LuxorState {
    fn default() -> Self {
        LuxorState {
            numbers: vec![],
            fields: vec![],
        }
    }
}

type LuxorType = UsePersistent<LuxorState>;

#[component]
pub fn Luxor() -> Element {
    let state = use_persistent("luxor", || LuxorState::default());
    use_context_provider(|| state);

    rsx! {
        Header { title: &"Luxor", Controls {} }
        Body {
            class: "luxor",

        }
    }
}
