use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

use crate::utils::{LSCompatStruct, LSCompatType};

#[derive(Serialize, Deserialize, Clone)]
pub(crate) struct Item {
    pub(crate) id: u8,
    pub(crate) name: String,
}

type Inner = Vec<Item>;
impl LSCompatType for Inner {}
impl LSCompatStruct for Inner {
    const STORAGE_KEY: &'static str = "shopping-list-items";
}
type GsItems = GlobalSignal<Inner>;

pub(crate) static ITEMS: GsItems = GlobalSignal::new(|| Inner::load());

pub(crate) trait TrItems {
    fn add(&self, item: String);
    fn rm(&self, str_id: &String);
}

impl TrItems for GsItems {
    fn add(&self, item: String) {
        let id = if let Some(id) = self.iter().map(|i| i.id).max() {
            id + 1
        } else {
            0
        };

        self.with_mut(|w| {
            w.push(Item { id, name: item });
            w.save();
        });
    }

    fn rm(&self, str_id: &String) {
        let id = str_id[4..].parse::<u8>().unwrap();

        self.with_mut(|w| {
            w.retain(|item| item.id != id);
            w.save();
        });
    }
}
