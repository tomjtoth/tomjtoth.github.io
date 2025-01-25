use dioxus::logger::tracing;
use dioxus::prelude::*;
use fancy_regex::Regex;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};

use crate::{components::shopping_list::models::RECIPES_ID, utils::LocalStorageCompatible};

static RE_RECIPE: Lazy<Regex> =
    Lazy::new(|| Regex::new(&format!("^{}(?:-\\d+)?$", RECIPES_ID.to_string())).unwrap());

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Active(Vec<String>);

impl Default for Active {
    fn default() -> Self {
        Active(vec![RECIPES_ID.to_string()])
    }
}

impl LocalStorageCompatible for Active {
    const STORAGE_KEY: &'static str = "shopping-list-active";
}

impl Active {
    pub fn init() -> Self {
        Self::load()
    }

    pub fn iter(&self) -> std::slice::Iter<String> {
        self.0.iter()
    }

    pub fn is_str(&self, id: &str) -> bool {
        self.is(&id.to_string())
    }
    pub fn is(&self, id: &String) -> bool {
        self.0.contains(id)
    }

    pub fn toggle_str(&mut self, str: &'static str) {
        self.toggle(&str.to_string());
    }

    pub fn toggle(&mut self, str: &String) {
        tracing::debug!("toggling {str}");
        if self.0.contains(&str) {
            if str.starts_with(&RECIPES_ID) && str.len() > RECIPES_ID.len() {
                // if a recipe was clicked, deactivate all it's items
                let slr_num_ = format!("{str}-");
                self.0.retain(|id| !id.starts_with(&slr_num_));
            } else {
                self.rm(str);
            }
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

    pub fn reset(&mut self) {
        self.0.retain(|id| {
            if let Ok(res) = RE_RECIPE.is_match(id) {
                res
            } else {
                false
            }
        });
        self.save();
    }
}

pub type SigActive = Signal<Active>;
