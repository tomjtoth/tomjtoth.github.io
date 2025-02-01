use dioxus::logger::tracing;
use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

use crate::utils::LocalStorageCompatible;

#[derive(Clone)]
pub struct CxActive {
    inner: Signal<Inner>,
}

impl CxActive {
    pub fn init() {
        let inner = Inner::load_sig();
        use_context_provider(|| CxActive { inner });
    }

    pub fn is(&self, id: &String) -> bool {
        let r = self.inner.read();
        r.active.contains(id)
    }

    pub fn toggle(&mut self, str: &String) {
        tracing::debug!("toggling {str}");
        let mut w = self.inner.write();

        if w.active.contains(&str) {
            w.active.retain(|id| id != str);
        } else {
            w.active.push(str.to_string());
        }
        w.save();
        tracing::debug!("{:?}", w.active);
    }
}

#[derive(Serialize, Deserialize)]
struct Inner {
    active: Vec<String>,
}

impl Default for Inner {
    fn default() -> Self {
        Inner { active: vec![] }
    }
}

impl LocalStorageCompatible for Inner {
    const STORAGE_KEY: &'static str = "lyrics-active";
}
