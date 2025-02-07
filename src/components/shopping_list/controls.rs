use dioxus::prelude::*;

use crate::components::{modal::*, shopping_list::models::*};

#[component]
pub(crate) fn Controls() -> Element {
    let mut input = use_signal(|| String::new());

    let (title, emoji) = if ACTIVE.is_str(&RECIPES_ID) {
        ("sulje reseptit", "📖")
    } else {
        ("avaa reseptit", "📕")
    };

    let reset_active = use_callback(move |_| {
        ACTIVE.reset();
    });

    rsx! {
        form {
            id: "slr-control",

            onsubmit: move |_| {
                if !input().trim().is_empty() {
                    ITEMS.add(input());
                }
                input.set("".to_string());
            },

            span {
                id: "slr-toggler",
                class: "clickable",
                title,
                onclick: move |_| {
                    ACTIVE.toggle_str(RECIPES_ID);
                },
                "{emoji}"
            }

            input {
                id: "sli-adder",
                placeholder: "lisää tavara tänne",
                value: input(),
                oninput: move |evt| {
                    evt.prevent_default();
                    input.set(evt.value());
                },
            }

            span {
                id: "sli-reset",
                class: "clickable",
                title: "pyyhi vihreät",
                onclick: move |_| {
                    MODAL.yes(Some(reset_active)).no(None).prompt(rsx! { "pyyhitäänkö kaikki vihreät?" })
                },
                "♻️"
            }
        }
    }
}
