use dioxus::prelude::*;

use crate::components::{
    modal::{Button, ModalState, SigModalState},
    shopping_list::models::{DiskActive, DiskItems, RECIPES_ID},
};

#[component]
pub fn Controls() -> Element {
    let mut modal = use_context::<SigModalState>();
    let mut disk_items = use_context::<DiskItems>();
    let mut disk_active = use_context::<DiskActive>();
    let mut item = use_signal(|| String::new());

    let (title, emoji) = if disk_active.get().0.contains(&RECIPES_ID.to_string()) {
        ("sulje reseptit", "📖")
    } else {
        ("avaa reseptit", "📕")
    };

    let reset_active = use_callback(move |_| {
        let mut active = disk_active.get();
        active.reset();
        disk_active.set(active);
    });

    rsx! {
        form {
            id: "slr-control",

            onsubmit: move |_| {
                if !item().trim().is_empty() {
                    let mut items = disk_items.get();
                    items.add(item());
                    disk_items.set(items);
                }
                item.set("".to_string());
            },

            span {
                id: "slr-toggler",
                class: "clickable",
                title,
                onclick: move |_| {
                    let mut active = disk_active.get();
                    active.toggle_str(RECIPES_ID);
                    disk_active.set(active);
                },
                "{emoji}"
            }

            input {
                id: "sli-adder",
                placeholder: "lisää tavara tänne",
                autofocus: true,
                value: item(),
                oninput: move |evt| {
                    evt.prevent_default();
                    item.set(evt.value());
                },
            }

            span {
                id: "sli-reset",
                class: "clickable",
                title: "pyyhi vihreät",
                onclick: move |_| {
                    modal.set(ModalState {
                        prompt: Some(rsx! { "pyyhitäänkö kaikki vihreät?" }),
                        buttons: vec![
                            (Button::Yes, Some(reset_active)),
                            (Button::No, None)
                        ],
                        lang: None
                    })
                },
                "♻️"
            }
        }
    }
}
