use serde::{Deserialize, Serialize};

use crate::utils::UsePersistent;

#[derive(Serialize, Deserialize, Clone)]
pub struct Item {
    pub id: u8,
    pub name: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Items(pub Vec<Item>);

impl Default for Items {
    fn default() -> Self {
        Items(vec![])
    }
}

impl Items {
    pub fn add(&mut self, item: String) {
        let id = if let Some(id) = self.0.iter().map(|i| i.id).max() {
            id + 1
        } else {
            0
        };
        self.0.push(Item { id, name: item });
    }

    pub fn rm(&mut self, str_id: &String) {
        let id = str_id[4..].parse::<u8>().unwrap();
        self.0.retain(|item| item.id != id);
    }
}

trait DiskItem {
    fn add(&mut self, item: String) {}
    fn rm(&mut self, id: u8) {}
}

pub type DiskItems = UsePersistent<Items>;

// impl DiskItem for DiskItems {
//     fn add(&mut self, item: String) {
//         let id = if let Some(id) = self.0.iter().map(|i| i.id).max() {
//             id + 1
//         } else {
//             0
//         };
//         self.get().0.push(Item { id, name: item });
//     }

//     fn rm(&mut self, id: u8) {
//         self.retain(|item| item.id != id);
//     }
// }
