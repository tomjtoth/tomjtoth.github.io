use dioxus::signals::Signal;
use serde::{Deserialize, Serialize};

use crate::utils::LocalStorageCompatible;

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct SidepanelState(bool);

impl SidepanelState {
    pub fn init() -> Self {
        Self::load()
    }

    pub fn is_active(&self) -> bool {
        self.0
    }

    pub fn set(&mut self, to: bool) {
        self.0 = to;
        self.save();
    }
}

impl LocalStorageCompatible for SidepanelState {
    const STORAGE_KEY: &'static str = "sidepanel";
}

pub type SigSidepanel = Signal<SidepanelState>;
