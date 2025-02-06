use std::{cmp::Ordering, collections::HashMap};

use dioxus::{logger::tracing, prelude::*};
use fancy_regex::Regex;
use once_cell::sync::Lazy;
use serde::Deserialize;

use crate::utils::{from_cache, to_yaml};

#[derive(Deserialize, Debug, Clone)]
struct Lang {
    title: String,
}

#[derive(Deserialize, Debug, Clone)]
struct Opts {
    lang: Lang,
}

#[derive(Deserialize)]
struct RecipeParserHelper {
    url: Option<String>,
    opts: Option<Opts>,
    steps: Vec<String>,
}

#[derive(Debug, Clone)]
pub(crate) struct Recipe {
    pub(crate) title: String,
    pub(crate) url: Option<String>,
    opts: Option<Opts>,
    pub(crate) items: Vec<String>,
    pub(crate) steps: Vec<String>,
}

impl Recipe {
    pub(crate) fn opts_lang_title(&self) -> Option<String> {
        match &self.opts {
            Some(Opts {
                lang: Lang { title },
            }) => Some(title).cloned(),
            _ => None,
        }
    }
}

type GsRecipes = GlobalSignal<Vec<Recipe>>;

pub(crate) static RECIPES: GsRecipes = GlobalSignal::new(|| vec![]);

static RE_ITEM: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?:(?:\[`(?<nameUrl>[^`]+)`\]\((?<url>.+)\))|`(?<name>[^`]+)`)(?: *[-:])?")
        .unwrap()
});

static RE_STRONG: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?:\*\*(?<vAsterisk>[^*]+)\*\*|\b__(?<vUnderscore>[^_]+)__\b)").unwrap()
});

pub(crate) trait TrRecipes {
    async fn init(&self);
}

impl TrRecipes for GsRecipes {
    async fn init(&self) {
        let mut url = asset!("/assets/recipes.yaml").to_string();
        if let Ok(Some(cached)) = from_cache(&url).await {
            url = cached;
        }

        let yaml_recipes: HashMap<String, RecipeParserHelper> = to_yaml(&url).await;

        let mut recipes = yaml_recipes
            .into_iter()
            .map(|(title, mut r)| {
                let mut items = vec![];

                for step in &mut r.steps {
                    let mut new_step = String::with_capacity(step.len());
                    let mut last_match = 0;

                    // replacing links and code blocks, also extracting items of recipe
                    for caps in RE_ITEM.captures_iter(&step) {
                        let caps = caps.unwrap();
                        let m = caps.get(0).unwrap();
                        new_step.push_str(&step[last_match..m.start()]);

                        let item = if let Some(name) = caps.get(3) {
                            let item = name.as_str();
                            new_step.push_str(&format!(r#"<code class="sli">{item}</code>"#));
                            item
                        } else {
                            let name_url = caps.get(1).unwrap();
                            let url = caps.get(2).unwrap();
                            let item = name_url.as_str();
                            let url = url.as_str();
                            new_step.push_str(&format!(r#"<code class="sli">{item}</code>"#));
                            new_step.push_str(&format!(
                                r#"<a class="sli" href="{url}" target="_blank">🔗</a>"#
                            ));

                            item
                        };
                        items.push(item.to_string());
                        last_match = m.end();
                    }

                    // dumping <code> and <a> tag replacements into step
                    if new_step.len() > 0 {
                        step.replace_range(.., &new_step);
                    }
                    // resetting helpers
                    new_step.clear();
                    last_match = 0;

                    // replacing __these__ and **these** markdown with <strong> tags
                    for caps in RE_STRONG.captures_iter(&step) {
                        let caps = caps.unwrap();
                        let m = caps.get(0).unwrap();
                        new_step.push_str(&step[last_match..m.start()]);

                        let bold = if let Some(bold) = caps.get(1) {
                            bold.as_str()
                        } else {
                            caps.get(2).unwrap().as_str()
                        };

                        new_step.push_str(&format!(r#"<strong>{bold}</strong>"#));
                        last_match = m.end();
                    }
                    if new_step.len() > 0 {
                        step.replace_range(.., &new_step);
                    }
                }

                Recipe {
                    title,
                    url: r.url,
                    steps: r.steps,
                    opts: r.opts,
                    items,
                }
            })
            .collect::<Vec<Recipe>>();

        recipes.sort_by(|a, b| {
            let aa = a.title[5..].to_lowercase();
            let bb = b.title[5..].to_lowercase();

            if aa < bb {
                Ordering::Less
            } else if aa > bb {
                Ordering::Greater
            } else {
                Ordering::Equal
            }
        });

        tracing::debug!("recipes.yaml processed");
        self.with_mut(|w| w.append(&mut recipes));
    }
}
