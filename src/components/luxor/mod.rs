use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

mod controls;
mod nums_line;
use crate::{
    components::{Body, Header},
    utils::{use_persistent, UsePersistent},
};
use controls::Controls;
use nums_line::PickedNumsLine;

#[derive(Serialize, Deserialize, Clone)]
struct Field {
    id: usize,
    order: usize,
    numbers: Vec<u8>,
}
impl Default for Field {
    fn default() -> Self {
        Field {
            id: 0,
            order: 0,
            numbers: [0u8; 25].to_vec(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
struct LuxorNumbers(Vec<u8>);
impl Default for LuxorNumbers {
    fn default() -> Self {
        LuxorNumbers(vec![])
    }
}

#[derive(Serialize, Deserialize, Clone)]
struct LuxorFields(Vec<Field>);
impl Default for LuxorFields {
    fn default() -> Self {
        LuxorFields(vec![])
    }
}

type DiskLuxorFields = UsePersistent<LuxorFields>;
type DiskLuxorNumbers = UsePersistent<LuxorNumbers>;

#[component]
pub fn Luxor() -> Element {
    let numbers = use_persistent("luxor-numbers", || LuxorNumbers::default());
    use_context_provider(|| numbers);

    let fields = use_persistent("luxor-fields", || LuxorFields::default());
    use_context_provider(|| fields);

    rsx! {
        Header { title: &"Luxor", Controls {} }
        Body {
            class: "luxor",
            PickedNumsLine {}
        }
    }
}
