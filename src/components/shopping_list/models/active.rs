use dioxus::{logger::tracing, prelude::*};
use fancy_regex::Regex;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};

use crate::{components::shopping_list::models::RECIPES_ID, utils::LocalStorageCompatible};

static RE_RECIPE: Lazy<Regex> =
    Lazy::new(|| Regex::new(&format!("^{}(?:-\\d+)?$", RECIPES_ID.to_string())).unwrap());

#[derive(Serialize, Deserialize)]
pub struct Inner {
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

type GsActive = GlobalSignal<Inner>;

pub static ACTIVE: GsActive = GlobalSignal::new(|| Inner::load());

pub trait TrActive {
    fn iter(&self) -> impl Iterator<Item = String>;
    fn is_str(&self, id: &str) -> bool;
    fn is(&self, id: &String) -> bool;
    fn toggle_str(&self, str: &'static str);
    fn toggle(&self, str: &String);
    fn rm(&self, str: &String);
    fn reset(&self);
}

impl TrActive for GsActive {
    fn iter(&self) -> impl Iterator<Item = String> {
        let r = self.read();
        r.active.clone().into_iter()
    }

    fn is_str(&self, id: &str) -> bool {
        self.is(&id.to_string())
    }

    fn is(&self, id: &String) -> bool {
        self.with(|r| r.active.contains(id))
    }

    fn toggle_str(&self, str: &'static str) {
        self.toggle(&str.to_string());
    }

    fn toggle(&self, str: &String) {
        tracing::debug!("toggling {str}");
        if self.is(str) {
            if str == RECIPES_ID {
                self.rm(str);
            } else {
                // if a recipe was clicked, deactivate all it's items
                let slr_num_items = Regex::new(&format!(r"^{str}(?:-\d+)?$")).unwrap();
                self.with_mut(|w| w.active.retain(|id| !slr_num_items.is_match(id).unwrap()));
            }
        } else {
            self.with_mut(|w| w.active.push(str.to_string()));
        }
        self.with_mut(|w| {
            w.save();
            tracing::debug!("{:?}", w.active);
        });
    }

    fn rm(&self, str: &String) {
        self.with_mut(|w| {
            w.active.retain(|id| id != str);
            w.save();
        });
    }

    fn reset(&self) {
        self.with_mut(|w| {
            w.active.retain(|id| {
                if let Ok(res) = RE_RECIPE.is_match(id) {
                    res
                } else {
                    false
                }
            });
            w.save();
        });
    }
}
