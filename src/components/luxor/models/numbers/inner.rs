use dioxus::signals::Signal;
use serde::{Deserialize, Serialize};

use crate::utils::LocalStorageCompatible;

#[derive(Serialize, Deserialize)]
pub struct Inner {
    pub numbers: Vec<u8>,
}

impl Default for Inner {
    fn default() -> Self {
        Inner { numbers: vec![] }
    }
}

impl LocalStorageCompatible for Inner {
    const STORAGE_KEY: &'static str = "luxor-numbers";
}

impl Inner {
    pub fn init() -> Signal<Self> {
        Self::load_sig()
    }
}
