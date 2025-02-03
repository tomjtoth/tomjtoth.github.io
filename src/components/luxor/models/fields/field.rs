use serde::{Deserialize, Serialize};

pub(crate) type LuxorRow = [u8; 5];
pub(crate) type LuxorRows = [LuxorRow; 5];

#[derive(Serialize, Deserialize, Clone)]
pub(crate) struct Field {
    pub(crate) id: u8,
    pub(crate) order: u8,
    pub(crate) rows: LuxorRows,
    pub(crate) imported_at: Option<i64>,
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
