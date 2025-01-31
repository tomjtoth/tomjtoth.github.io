use serde::{Deserialize, Serialize};

pub type LuxorRow = [u8; 5];
pub type LuxorRows = [LuxorRow; 5];

#[derive(Serialize, Deserialize, Clone)]
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
