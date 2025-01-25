use chrono::Utc;
use dioxus::signals::Signal;
use serde::{Deserialize, Serialize};

use crate::utils::{init_ctx, LocalStorageCompatible};

pub type LuxorRow = [u8; 5];
type LuxorRows = [LuxorRow; 5];

#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct Field {
    pub id: u8,
    pub order: u8,
    pub rows: LuxorRows,
    pub imported_at: Option<i64>,
}

impl Default for Field {
    fn default() -> Self {
        Field {
            id: 0,
            order: 0,
            rows: [[0; 5]; 5],
            imported_at: None,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Fields(Vec<Field>);
impl Default for Fields {
    fn default() -> Self {
        Fields(vec![Field::default()])
    }
}

impl LocalStorageCompatible for Fields {
    const STORAGE_KEY: &'static str = "luxor-fields";
}

impl Fields {
    pub fn init() {
        init_ctx(|| Self::load());
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn get(&self, idx: usize) -> Option<&Field> {
        self.0.get(idx)
    }

    pub fn into_iter(&self) -> std::vec::IntoIter<Field> {
        self.0.clone().into_iter()
    }

    pub fn update_num(&mut self, field_idx: usize, row_idx: usize, idx: usize, num: u8) {
        self.0[field_idx].rows[row_idx][idx] = num;
        self.save();
    }

    pub fn add_after(&mut self, id: u8) {
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
        self.save();
    }

    pub fn rm(&mut self, id: u8) {
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
        self.save();
    }

    pub fn push(&mut self, fields: Vec<[[u8; 5]; 5]>) {
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
        self.save();
    }
}

pub type SigFields = Signal<Fields>;
