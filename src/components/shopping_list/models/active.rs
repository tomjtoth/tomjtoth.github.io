use dioxus::logger::tracing;
use fancy_regex::Regex;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};

use crate::{components::shopping_list::models::RECIPES_ID, utils::UsePersistent};

#[derive(Serialize, Deserialize, Clone)]
pub struct Active(pub Vec<String>);

impl Default for Active {
    fn default() -> Self {
        Active(vec![RECIPES_ID.to_string()])
    }
}

static RE_RECIPE: Lazy<Regex> =
    Lazy::new(|| Regex::new(&format!("^{}(?:-\\d+)?$", RECIPES_ID.to_string())).unwrap());

// TODO: implement a bitwise ops method for storing ids of slr and sli
// enum Item {
//     A(usize), //slr == 0
//     B(usize, usize),
//     C(usize, usize, usize),
// }

impl Active {
    pub fn toggle_str(&mut self, str: &'static str) {
        self.toggle(&str.to_string());
    }

    pub fn toggle(&mut self, str: &String) {
        tracing::debug!("toggling {str}");
        if self.0.contains(&str) {
            if str.starts_with(&RECIPES_ID) && str.len() > RECIPES_ID.len() {
                // if a recipe was clicked, deactivate all it's items
                self.0.retain(|id| !id.starts_with(str));
            } else {
                self.rm(str);
            }
        } else {
            self.0.push(str.to_string());
        }
        tracing::debug!("{:?}", self.0);
    }

    pub fn rm(&mut self, str: &String) {
        self.0.retain(|id| id != str);
    }

    pub fn reset(&mut self) {
        self.0.retain(|id| {
            if let Ok(res) = RE_RECIPE.is_match(id) {
                res
            } else {
                false
            }
        });
    }
}

pub type DiskActive = UsePersistent<Active>;
