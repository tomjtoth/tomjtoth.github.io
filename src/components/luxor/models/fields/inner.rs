use dioxus::signals::Signal;
use serde::{Deserialize, Serialize};

use crate::utils::LocalStorageCompatible;

use super::Field;

#[derive(Serialize, Deserialize)]
pub struct Inner {
    pub fields: Vec<Field>,
}

impl Default for Inner {
    fn default() -> Self {
        Inner {
            fields: vec![Field::default()],
        }
    }
}

impl LocalStorageCompatible for Inner {
    const STORAGE_KEY: &'static str = "luxor-fields";
}

impl Inner {
    pub fn init() -> Signal<Self> {
        Self::load_sig()
    }
}
