use dioxus::prelude::*;

use crate::components::{
    modal::{Button, ModalState, SigModal},
    shopping_list::models::{SigActive, SigItems, RECIPES_ID},
};

#[component]
pub fn Controls() -> Element {
    let mut modal = use_context::<SigModal>();
    let mut items = use_context::<SigItems>();
    let mut active = use_context::<SigActive>();
    let mut input = use_signal(|| String::new());

    let (title, emoji) = if active().is_str(&RECIPES_ID) {
        ("sulje reseptit", "📖")
    } else {
        ("avaa reseptit", "📕")
    };

    let reset_active = use_callback(move |_| {
        active.write().reset();
    });

    rsx! {
        form {
            id: "slr-control",

            onsubmit: move |_| {
                if !input().trim().is_empty() {
                    items.write().add(input());
                }
                input.set("".to_string());
            },

            span {
                id: "slr-toggler",
                class: "clickable",
                title,
                onclick: move |_| {
                    active.write().toggle_str(RECIPES_ID);
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
