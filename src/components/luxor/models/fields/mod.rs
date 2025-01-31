use chrono::Utc;
use dioxus::prelude::*;

mod field;
mod inner;

pub use field::*;
use inner::Inner;

use crate::utils::LocalStorageCompatible;

#[derive(Clone)]
pub struct CxFields {
    inner: Signal<Inner>,
}

impl CxFields {
    pub fn init() {
        let inner = Inner::init();
        use_context_provider(|| CxFields { inner });
    }

    pub fn len(&self) -> usize {
        self.inner.read().fields.len()
    }

    pub fn get(&self, index: usize) -> Option<Field> {
        let r = self.inner.read();
        r.fields.get(index).cloned()
    }

    pub fn into_iter(&self) -> std::vec::IntoIter<Field> {
        self.inner.read().fields.clone().into_iter()
    }

    pub fn update_num(&mut self, field_idx: usize, row_idx: usize, idx: usize, num: u8) {
        let mut w = self.inner.write();
        w.fields[field_idx].rows[row_idx][idx] = num;
        w.save();
    }

    // TODO: moving the fields are possible via changing the orders

    pub fn add_after(&mut self, id: u8) {
        let mut w = self.inner.write();

        let idx = w.fields.iter().position(|f| f.id == id).unwrap();
        let Field { order, .. } = w.fields[idx];
        let mut max_id = 0;

        for field in w.fields.iter_mut() {
            // move the rest to the right
            if field.order > order {
                field.order += 1;
            }

            // also make note on max_id
            if field.id > max_id {
                max_id = field.id;
            }
        }

        w.fields.insert(
            idx + 1,
            Field {
                id: max_id + 1,
                order: order + 1,
                rows: [[0; 5]; 5],
                imported_at: None,
            },
        );

        w.save();
    }

    pub fn rm(&mut self, id: u8) {
        let mut w = self.inner.write();
        let idx = w.fields.iter().position(|f| f.id == id).unwrap();
        let Field { order, .. } = w.fields[idx];

        // delete by id
        w.fields.retain(|f| f.id != id);

        // move the rest to the left
        for field in w.fields.iter_mut() {
            if field.order > order {
                field.order -= 1;
            }
        }

        w.save();
    }

    pub fn push(&mut self, fields: Vec<[[u8; 5]; 5]>) {
        let mut w = self.inner.write();

        let base_id = w.fields.iter().map(|f| f.id).max().unwrap() + 1;
        let base_order = w.fields.len() as u8;

        for (idx, rows) in fields.into_iter().enumerate() {
            let idx_u8 = idx as u8;
            w.fields.push(Field {
                id: base_id + idx_u8,
                order: base_order + idx_u8,
                rows,
                imported_at: Some(Utc::now().timestamp()),
            })
        }

        w.save();
    }
}
