use std::cmp::Ordering;

use dioxus::prelude::*;
use fancy_regex::Regex;
use once_cell::sync::Lazy;

use crate::components::{
    modal::{Button, ModalState, SigModalState},
    shopping_list::{config::RE_ORDER, DiskActive, DiskItems, SigRecipes},
};
static RE_RECIPE_ID: Lazy<Regex> = Lazy::new(|| Regex::new(r"^slr-(?<recId>\d+)$").unwrap());

fn find_idx(name: &String) -> u16 {
    let idx = if let Some(idx) = RE_ORDER.iter().position(|re| re.is_match(name).unwrap()) {
        (idx + 1) as u16
    } else {
        0
    };
    idx
}

// TODO: improve ID handling
enum StringOrU8 {
    Str(String),
    U8(u8),
}

#[component]
pub fn Items() -> Element {
    let mut disk_active = use_context::<DiskActive>();
    let mut disk_items = use_context::<DiskItems>();
    let sig_recipe = use_context::<SigRecipes>();
    let mut modal = use_context::<SigModalState>();

    let mut ul_items = disk_items
        .get()
        .0
        .iter()
        .map(|i| {
            (
                find_idx(&i.name),
                format!("sli-{}", i.id),
                i.name.to_string(),
            )
        })
        .collect::<Vec<(u16, String, String)>>();

    for active in disk_active.get().0.iter() {
        if let Ok(Some(mm)) = RE_RECIPE_ID.captures(active) {
            let rec_idx = mm.get(1).unwrap().as_str().parse::<usize>().unwrap();
            let recipe = &sig_recipe.read().0[rec_idx];
            for (idx, item) in recipe.items.iter().enumerate() {
                ul_items.push((
                    find_idx(&item),
                    format!("slr-{rec_idx}-{idx}"),
                    format!("{} ({})", item.to_string(), recipe.title),
                ))
            }
        }
    }

    ul_items.sort_by(|a, b| {
        // order by index of which RE matched
        if a.0 < b.0 {
            Ordering::Less
        } else if a.0 > b.0 {
            Ordering::Greater
        } else {
            // order by ABC if at same location
            if a.2 < b.2 {
                Ordering::Less
            } else if a.2 > b.2 {
                Ordering::Greater
            } else {
                Ordering::Equal
            }
        }
    });

    rsx! {
        h2 {
            class: "sli",

            if ul_items.len() > 0 {
                "tavarat listallasi"
            } else {
                "listasi on tyhjä, lisää kamaa!"
            }
        }

        ul {
            id: "sli",

            {ul_items.into_iter().map(|(idx, id, name)| {

                let class = format!(
                    "clickable padded alternating sli{}",
                    if disk_active.get().0.contains(&id) {
                        " active"
                    } else {
                        ""
                    }
                );

                let toggle_active_id = id.clone();
                let toggle_active =  move |_| {
                    let mut active = disk_active.get();
                    active.toggle(&toggle_active_id);
                    disk_active.set(active);
                };

                let rm_item = use_callback({
                    let id = id.clone();
                    move |evt: Event<MouseData>| {
                        evt.stop_propagation();
                        let mut items = disk_items.get();
                        items.rm(&id);
                        disk_items.set(items);

                        let mut active = disk_active.get();
                        active.rm(&id);
                        disk_active.set(active);
                    }
                });

                rsx!{
                    li {
                        key: "{id}",
                        class,
                        onclick: toggle_active,

                        "{name}"
                        if idx == 0 {
                            span {
                                class: "unknown-item",
                                title: "tuntematon tavara",
                                "❓"
                            }
                        }

                        if !id.starts_with("slr-") {
                            span {
                                class: "sli-del clickable",
                                onclick: move |evt| {
                                        evt.stop_propagation();
                                        modal.set(ModalState {
                                            prompt: Some(rsx! { "poistetaanko \"{name}\" varmasti?" }),
                                            buttons: vec![
                                                (Button::Yes, Some(rm_item)),
                                                (Button::No, None)
                                            ],
                                            lang: None
                                        })
                                    },


                                "(🚫 poista)"
                            }
                        }
                    }
                }
            })

            }

        }
    }
}
