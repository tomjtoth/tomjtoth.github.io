use dioxus::prelude::*;

use crate::components::{
    shopping_list::{
        items::Items,
        models::{Lang, Opts, SigActive, SigRecipes, RECIPES_ID},
        steps::Steps,
    },
    Loader,
};

#[component]
pub fn Recipes() -> Element {
    let mut recipes = use_context::<SigRecipes>();
    let mut active = use_context::<SigActive>();

    let class = if active().is(&RECIPES_ID.to_string()) {
        Some("active")
    } else {
        None
    };

    use_future(move || async move {
        recipes.write().init().await;
    });

    rsx! {
        if recipes().len() == 0 {
            Loader {}
        } else {
            ul {
                id: RECIPES_ID,
                class,

                {recipes().iter().enumerate().map(|(i, r)| {
                    let key = format!("slr-{i}");

                    let class = format!("clickable padded alternating recipe{}",
                        // TODO: is this reading from the disk on each call?
                        if let Some(_) = active().iter().position(|stored| stored == &key.to_string()) {
                            " active"
                        } else {
                            ""
                        }
                    );

                    // TODO: assign this optionally
                    let lang = match &r.opts {
                        Some(Opts{
                            lang: Lang {
                                title
                            }
                        }) => Some(title),
                        _ => None,
                    };

                    let onclick = {
                        let key = key.clone();
                        move |_| {
                            active.write().toggle(&key);
                        }
                    };

                    let children = rsx! {

                        "{r.title}"

                        if let Some(url) = &r.url {
                            a {
                                href: url.to_string(),
                                target: "_blank",
                                class: "sli",
                                onclick: |evt| {evt.stop_propagation(); },
                                "🔗"
                            }
                        }

                        if let Some(_) = lang {
                            Steps {
                                steps: r.steps.clone(),
                                lang: "fi",
                            }
                        } else {
                            Steps {
                                steps: r.steps.clone(),
                            }
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
                            li {
                                key,
                                class,
                                onclick,
                                {children}
                            }
                        }
                    }
                })}
            }
            Items {}
        }
    }
}
