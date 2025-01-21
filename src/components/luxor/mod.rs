use chrono::Utc;
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

impl LuxorFields {
    fn add_after(&mut self, id: u8) {
        let idx = self.0.iter().position(|&f| f.id == id).unwrap();
        let Field { order, .. } = self.0[idx];
        let mut max_id = 0;

        for field in self.0.iter_mut() {
            // move the rest to the right
            if field.order > order {
                field.order += 1;
            }

            // also make note on max_id
            if field.id > max_id {
                max_id = field.id;
            }
        }

        self.0.push(Field {
            id: max_id + 1,
            order: order + 1,
            rows: [[0; 5]; 5],
            imported_at: None,
        });
    }

    fn rm(&mut self, id: u8) {
        let idx = self.0.iter().position(|&f| f.id == id).unwrap();
        let Field { order, .. } = self.0[idx];

        // delete by id
        self.0.retain(|&f| f.id != id);

        // move the rest to the left
        for field in self.0.iter_mut() {
            if field.order > order {
                field.order -= 1;
            }
        }
    }

    fn push(&mut self, fields: Vec<[[u8; 5]; 5]>) {
        let base_id = self.0.iter().map(|f| f.id).max().unwrap() + 1;
        let base_order = self.0.len() as u8;

        for (idx, rows) in fields.into_iter().enumerate() {
            let idx_u8 = idx as u8;
            self.0.push(Field {
                id: base_id + idx_u8,
                order: base_order + idx_u8,
                rows,
                imported_at: Some(Utc::now().timestamp()),
            })
        }
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
