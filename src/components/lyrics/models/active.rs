use dioxus::logger::tracing;
use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

use crate::utils::{init_ctx, LocalStorageCompatible};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Active(Vec<String>);
pub type SigActive = Signal<Active>;

impl Default for Active {
    fn default() -> Self {
        Active(vec![])
    }
}

impl LocalStorageCompatible for Active {
    const STORAGE_KEY: &'static str = "lyrics-active";
}

impl Active {
    pub fn init() {
        init_ctx(|| Self::load());
    }

    // pub fn iter(&self) -> std::slice::Iter<String> {
    //     self.0.iter()
    // }

    // pub fn is_str(&self, id: &str) -> bool {
    //     self.is(&id.to_string())
    // }

    pub fn is(&self, id: &String) -> bool {
        self.0.contains(id)
    }

    // pub fn toggle_str(&mut self, str: &'static str) {
    //     self.toggle(&str.to_string());
    // }

    pub fn toggle(&mut self, str: &String) {
        tracing::debug!("toggling {str}");
        if self.0.contains(&str) {
            self.rm(str);
        } else {
            self.0.push(str.to_string());
        }
        self.save();
        tracing::debug!("{:?}", self.0);
    }

    pub fn rm(&mut self, str: &String) {
        self.0.retain(|id| id != str);
        self.save();
    }

    // pub fn reset(&mut self) {
    //     self.0.clear();
    //     self.save();
    // }
}
