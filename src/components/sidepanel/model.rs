use dioxus::{logger::tracing, signals::Signal};
use serde::{Deserialize, Serialize};

use crate::utils::{init_ctx, LocalStorageCompatible};

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct Sidepanel(bool);

impl Sidepanel {
    pub fn init() {
        tracing::debug!("sidepanel state read from LS");

        init_ctx(|| Self::load());
    }

    pub fn is_active(&self) -> bool {
        self.0
    }

    pub fn set(&mut self, to: bool) {
        self.0 = to;
        self.save();
    }
}

impl LocalStorageCompatible for Sidepanel {
    const STORAGE_KEY: &'static str = "sidepanel";
}

pub type SigSidepanel = Signal<Sidepanel>;
