use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

use crate::utils::LocalStorageCompatible;

#[derive(Clone)]
pub struct CxItems {
    inner: Signal<Inner>,
}

impl CxItems {
    pub fn init() {
        let inner = Inner::load_sig();
        use_context_provider(|| Self { inner });
    }

    pub fn add(&mut self, item: String) {
        let mut w = self.inner.write();

        let id = if let Some(id) = w.items.iter().map(|i| i.id).max() {
            id + 1
        } else {
            0
        };
        w.items.push(Item { id, name: item });
        w.save();
    }

    pub fn rm(&mut self, str_id: &String) {
        let id = str_id[4..].parse::<u8>().unwrap();

        let mut w = self.inner.write();
        w.items.retain(|item| item.id != id);
        w.save();
    }

    pub fn iter(&self) -> impl Iterator<Item = Item> {
        let r = self.inner.read();
        r.items.clone().into_iter()
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Item {
    pub id: u8,
    pub name: String,
}

#[derive(Serialize, Deserialize)]
struct Inner {
    items: Vec<Item>,
}

impl Default for Inner {
    fn default() -> Self {
        Self { items: vec![] }
    }
}

impl LocalStorageCompatible for Inner {
    const STORAGE_KEY: &'static str = "shopping-list-items";
}
