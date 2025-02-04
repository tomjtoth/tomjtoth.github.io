use dioxus::{logger::tracing, prelude::*};
use fancy_regex::Regex;
use once_cell::sync::Lazy;

use crate::{components::shopping_list::models::RECIPES_ID, utils::LSCompatType};

static RE_RECIPE: Lazy<Regex> =
    Lazy::new(|| Regex::new(&format!("^{}(?:-\\d+)?$", RECIPES_ID.to_string())).unwrap());

static KEY: &'static str = "shopping-list-active";
type Active = Vec<String>;
type GsActive = GlobalSignal<Active>;

pub(crate) static ACTIVE: GsActive = GlobalSignal::new(|| {
    let mut v = Active::load_t(KEY);
    if v.len() == 0 {
        v.push(RECIPES_ID.to_string())
    }
    v
});

pub(crate) trait TrActive {
    fn is_str(&self, id: &str) -> bool;
    fn is(&self, id: &String) -> bool;
    fn toggle_str(&self, str: &'static str);
    fn toggle(&self, str: &String);
    fn rm(&self, str: &String);
    fn reset(&self);
    fn save(&self);
}

impl TrActive for GsActive {
    fn save(&self) {
        self.read().save_t(KEY);
    }
    fn is_str(&self, id: &str) -> bool {
        self.is(&id.to_string())
    }

    fn is(&self, id: &String) -> bool {
        self.with(|r| r.contains(id))
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
                self.with_mut(|w| w.retain(|id| !slr_num_items.is_match(id).unwrap()));
            }
        } else {
            self.with_mut(|w| w.push(str.to_string()));
        }
        self.save();
    }

    fn rm(&self, str: &String) {
        self.write().retain(|id| id != str);
        self.save();
    }

    fn reset(&self) {
        self.write().retain(|id| {
            if let Ok(res) = RE_RECIPE.is_match(id) {
                res
            } else {
                false
            }
        });
        self.save();
    }
}
