use dioxus::signals::Signal;
use serde::{Deserialize, Serialize};

use crate::utils::{init_ctx, LocalStorageCompatible};

#[derive(Serialize, Deserialize, Clone)]
pub struct Item {
    pub id: u8,
    pub name: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Items(Vec<Item>);

impl Default for Items {
    fn default() -> Self {
        Items(vec![])
    }
}

impl LocalStorageCompatible for Items {
    const STORAGE_KEY: &'static str = "shopping-list-items";
}

impl Items {
    pub fn init() {
        init_ctx(|| Self::load());
    }

    pub fn add(&mut self, item: String) {
        let id = if let Some(id) = self.0.iter().map(|i| i.id).max() {
            id + 1
        } else {
            0
        };
        self.0.push(Item { id, name: item });
        self.save();
    }

    pub fn rm(&mut self, str_id: &String) {
        let id = str_id[4..].parse::<u8>().unwrap();
        self.0.retain(|item| item.id != id);
        self.save();
    }

    pub fn iter(&self) -> std::slice::Iter<Item> {
        self.0.iter()
    }
}

pub type SigItems = Signal<Items>;
