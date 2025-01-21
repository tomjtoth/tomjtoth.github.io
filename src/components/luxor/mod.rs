use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

mod controls;
mod fields;
mod nums_line;
use crate::{
    components::{Body, Header},
    utils::{use_persistent, UsePersistent},
};
use controls::Controls;
use fields::{Field, Fields};
use nums_line::PickedNumsLine;

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
        LuxorFields(vec![Field::default()])
    }
}

struct LuxorLocked(bool);

type DiskLuxorFields = UsePersistent<LuxorFields>;
type DiskLuxorNumbers = UsePersistent<LuxorNumbers>;
type SigLuxorLocked = Signal<LuxorLocked>;

#[component]
pub fn Luxor() -> Element {
    let numbers = use_persistent("luxor-numbers", || LuxorNumbers::default());
    use_context_provider(|| numbers);

    let fields = use_persistent("luxor-fields", || LuxorFields::default());
    use_context_provider(|| fields);

    let locked = use_signal(|| LuxorLocked(true));
    use_context_provider(|| locked);

    rsx! {
        Header { title: &"Luxor", Controls {} }
        Body {
            class: "luxor",
            PickedNumsLine {}
            Fields {}
        }
    }
}
