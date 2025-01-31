use dioxus::{hooks::use_signal, signals::Signal};
use serde::{Deserialize, Serialize};

use crate::utils::LocalStorageCompatible;

#[derive(Serialize, Deserialize)]
pub struct Inner {
    pub active: bool,
}

impl Default for Inner {
    fn default() -> Self {
        Self { active: false }
    }
}

impl LocalStorageCompatible for Inner {
    const STORAGE_KEY: &'static str = "sidepanel";
}

impl Inner {
    pub fn init() -> Signal<Self> {
        use_signal(|| Inner::load())
    }
}
