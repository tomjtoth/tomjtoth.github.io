use dioxus::logger::tracing;
use dioxus::prelude::*;
use fancy_regex::Regex;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};

use crate::{components::shopping_list::models::RECIPES_ID, utils::LocalStorageCompatible};

static RE_RECIPE: Lazy<Regex> =
    Lazy::new(|| Regex::new(&format!("^{}(?:-\\d+)?$", RECIPES_ID.to_string())).unwrap());

#[derive(Clone)]
pub struct CxActive {
    inner: Signal<Inner>,
}

impl CxActive {
    pub fn init() {
        let inner = Inner::load_sig();
        use_context_provider(|| Self { inner });
    }

    pub fn iter(&self) -> impl Iterator<Item = String> {
        let r = self.inner.read();
        r.active.clone().into_iter()
    }

    pub fn is_str(&self, id: &str) -> bool {
        self.is(&id.to_string())
    }
    pub fn is(&self, id: &String) -> bool {
        let r = self.inner.read();
        r.active.contains(id)
    }

    pub fn toggle_str(&mut self, str: &'static str) {
        self.toggle(&str.to_string());
    }

    pub fn toggle(&mut self, str: &String) {
        tracing::debug!("toggling {str}");
        if {
            let r = self.inner.read();
            r.active.contains(&str)
        } {
            if str == RECIPES_ID {
                self.rm(str);
            } else {
                // if a recipe was clicked, deactivate all it's items
                let slr_num_items = Regex::new(&format!(r"^{str}(?:-\d+)?$")).unwrap();
                let mut w = self.inner.write();
                w.active.retain(|id| !slr_num_items.is_match(id).unwrap());
            }
        } else {
            let mut w = self.inner.write();
            w.active.push(str.to_string());
        }
        let w = self.inner.write();
        w.save();
        tracing::debug!("{:?}", w.active);
    }

    pub fn rm(&mut self, str: &String) {
        let mut w = self.inner.write();
        w.active.retain(|id| id != str);
        w.save();
    }

    pub fn reset(&mut self) {
        let mut w = self.inner.write();
        w.active.retain(|id| {
            if let Ok(res) = RE_RECIPE.is_match(id) {
                res
            } else {
                false
            }
        });
        w.save();
    }
}

#[derive(Serialize, Deserialize)]
struct Inner {
    active: Vec<String>,
}

impl Default for Inner {
    fn default() -> Self {
        Self {
            active: vec![RECIPES_ID.to_string()],
        }
    }
}

impl LocalStorageCompatible for Inner {
    const STORAGE_KEY: &'static str = "shopping-list-active";
}
