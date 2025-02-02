use dioxus::prelude::*;

use crate::components::shopping_list::{models::*, steps::Steps};

#[component]
pub fn Recipes() -> Element {
    let class = if ACTIVE.is(&RECIPES_ID.to_string()) {
        Some("active")
    } else {
        None
    };

    rsx! {
        ul { id: RECIPES_ID, class,

            {
                RECIPES
                    .iter()
                    .enumerate()
                    .map(|(i, r)| {
                        let key = format!("slr-{i}");
                        let class = format!(
                            "clickable padded alternating recipe{}",
                            if ACTIVE.is(&key) { " active" } else { "" },
                        );
                        let lang = &r.opts_lang_title();
                        let onclick = {
                            let key = key.clone();
                            move |_| {
                                ACTIVE.toggle(&key);
                            }
                        };
                        let children = rsx! {

                            "{r.title}"

                            if let Some(url) = &r.url {
                                a {
                                    href: url.to_string(),
                                    target: "_blank",
                                    class: "sli",
                                    onclick: |evt| {
                                        evt.stop_propagation();
                                    },
                                    "🔗"
                                }
                            }

                            if let Some(_) = lang {
                                Steps { steps: r.steps.clone(), lang: "fi" }
                            } else {
                                Steps { steps: r.steps.clone() }
                            }
                        };
                        rsx! {
                            if let Some(overridden_lang) = lang {
                                li {
                                    key,
                                    class,
                                    lang: overridden_lang.to_string(),
                                    onclick,
                                    {children}
                                }
                            } else {
                                li { key, class, onclick, {children} }
                            }
                        }
                    })
            }
        }
    }
}
