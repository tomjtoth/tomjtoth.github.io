use chrono::Utc;
use dioxus::prelude::*;

use crate::utils::{LSCompatStruct, LSCompatType};

mod field;

pub(crate) use field::*;

type Fields = Vec<Field>;

impl LSCompatType for Fields {}
impl LSCompatStruct for Fields {
    const STORAGE_KEY: &'static str = "luxor-fields";
}

pub(crate) type GsFields = GlobalSignal<Fields>;

pub(crate) static FIELDS: GsFields = Signal::global(|| {
    let mut fields = Fields::load();
    if fields.is_empty() {
        fields.push(Field::default());
    }
    fields
});

pub(crate) trait TrFields {
    fn idx_of(&self, id: u8) -> usize;
    fn update(&self, field_idx: usize, row_idx: usize, idx: usize, num: u8);
    fn add_after(&self, id: u8);
    fn rm(&self, id: u8);
    fn import(&self, fields: Vec<[[u8; 5]; 5]>);
}

impl TrFields for GsFields {
    fn update(&self, field_idx: usize, row_idx: usize, idx: usize, num: u8) {
        self.with_mut(|w| {
            w[field_idx].rows[row_idx][idx] = num;
            w.save();
        });
    }

    fn idx_of(&self, id: u8) -> usize {
        self.iter().position(|x| x.id == id).unwrap()
    }

    // TODO: moving the fields are possible via changing the orders

    fn add_after(&self, id: u8) {
        let idx = self.idx_of(id);
        self.with_mut(|w| {
            let Field { order, .. } = w[idx];
            let mut max_id = 0;

            for field in w.iter_mut() {
                // move the rest to the right
                if field.order > order {
                    field.order += 1;
                }

                // also make note on max_id
                if field.id > max_id {
                    max_id = field.id;
                }
            }

            w.insert(
                idx + 1,
                Field {
                    id: max_id + 1,
                    order: order + 1,
                    rows: [[0; 5]; 5],
                    imported_at: None,
                },
            );

            w.save();
        });
    }

    fn rm(&self, id: u8) {
        let idx = self.iter().position(|f| f.id == id).unwrap();

        self.with_mut(|w| {
            let Field { order, .. } = w[idx];

            // delete by id
            w.retain(|f| f.id != id);

            // move the rest to the left
            for field in w.iter_mut() {
                if field.order > order {
                    field.order -= 1;
                }
            }

            w.save();
        });
    }

    fn import(&self, fields: Vec<[[u8; 5]; 5]>) {
        let base_order = self.len() as u8;
        let base_id = self.iter().map(|f| f.id).max().unwrap() + 1;

        self.with_mut(|w| {
            for (idx, rows) in fields.into_iter().enumerate() {
                let idx_u8 = idx as u8;
                w.push(Field {
                    id: base_id + idx_u8,
                    order: base_order + idx_u8,
                    rows,
                    imported_at: Some(Utc::now().timestamp()),
                })
            }

            w.save();
        });
    }
}
