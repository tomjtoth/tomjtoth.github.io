use dioxus::{logger::tracing, prelude::*};

use crate::components::{luxor::models::*, modal::*};

#[component]
pub(crate) fn Controls() -> Element {
    let mut input = use_signal(|| "".to_string());

    let clear_nums = use_callback(move |_| {
        tracing::debug!("clearing numbers in luxor state");
        NUMBERS.clear();
    });

    rsx! {
        form {
            id: "luxor-control",
            onsubmit: move |_| {
                if let Ok(as_u8) = input().parse::<u8>() {
                    NUMBERS.add(as_u8);
                }
                input.set("".to_string());
            },

            span {
                class: "padded clickable",
                onclick: move |_| {
                    let to = !LOCKED();
                    LOCKED.with_mut(|w| *w = to);
                },

                if LOCKED() {
                    "🔒"
                } else {
                    "🔓"
                }
            }

            input {
                id: "luxor-adder",
                r#type: "number",
                class: "bordered",
                max: 75,
                min: 0,
                autocomplete: "off",
                placeholder: "a következő nyerőszám",
                value: "{input}",
                oninput: move |evt| {
                    evt.prevent_default();
                    input.set(evt.value());
                },
            }

            span {
                class: "padded clickable",
                title: "jelölések törlése",
                onclick: move |_| {
                    MODAL
                        .lang(Language::Hu)
                        .buttons(vec![(Button::Ok, Some(clear_nums)), (Button::Cancel, None)])
                        .prompt(rsx! {
                            "Törlöm az "
                            strong { "összes" }
                            " húzott számot"
                        })
                },
                "♻️"
            }
        }
    }
}
