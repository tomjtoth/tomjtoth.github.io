use dioxus::{logger::tracing, prelude::*};

use crate::components::{
    shopping_list::{
        init,
        items::Items,
        models::{DiskActive, RECIPES_ID},
        steps::Steps,
        Lang, Opts, SigRecipes, TRecipes,
    },
    Loader,
};

#[component]
pub fn Recipes() -> Element {
    let mut sig_recipes = use_context::<SigRecipes>();
    let mut disk_active = use_context::<DiskActive>();
    let recipes = &sig_recipes.read().0;
    let active = disk_active.get();

    let class = if active.0.contains(&RECIPES_ID.to_string()) {
        Some("active")
    } else {
        None
    };

    use_future(move || async move {
        let fetched = init().await;
        sig_recipes.set(TRecipes(fetched));
    });

    rsx! {
        if recipes.len() == 0 {
            Loader {}
        } else {
            ul {
                id: RECIPES_ID,
                class,

                {recipes.iter().enumerate().map(|(i, r)| {
                    let key = format!("slr-{i}");

                    let class = format!("clickable padded alternating recipe{}",
                        // TODO: is this reading from the disk on each call?
                        if let Some(_) = active.0.iter().position(|stored| stored == &key.to_string()) {
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
                            let mut active = disk_active.get();
                            active.toggle(&key);
                            disk_active.set(active);
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

                        Steps {
                            steps: r.steps.clone(),
                            // TODO: get the optional dish_lang thingy
                            // lang,
                        }
                    };

                    rsx! {
                        li {
                            key: key,
                            class,
                            // lang,
                            onclick,
                            {children}
                        }
                    }
                })}
            }
            Items {}
        }
    }
}
