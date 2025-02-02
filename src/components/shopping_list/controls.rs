use dioxus::prelude::*;

use crate::components::{
    modal::{Button, CxModal},
    shopping_list::models::*,
};

#[component]
pub fn Controls() -> Element {
    let mut modal = use_context::<CxModal>();
    let mut items = use_context::<CxItems>();
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
                    items.add(input());
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
                    modal
                        .buttons(vec![(Button::Yes, Some(reset_active)), (Button::No, None)])
                        .prompt(rsx! { "pyyhitäänkö kaikki vihreät?" })
                },
                "♻️"
            }
        }
    }
}
