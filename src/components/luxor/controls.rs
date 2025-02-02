use crate::components::{
    luxor::models::{CxNumbers, SigLocked},
    modal::{Button, CxModal, Language},
};
use dioxus::{logger::tracing, prelude::*};

#[component]
pub fn Controls() -> Element {
    let mut modal = use_context::<CxModal>();
    let mut numbers = use_context::<CxNumbers>();

    let mut locked = use_context::<SigLocked>();
    let mut input = use_signal(|| "".to_string());

    let clear_nums = use_callback({
        let mut numbers = numbers.clone();
        move |_| {
            tracing::debug!("clearing numbers in luxor state");
            numbers.clear();
        }
    });

    rsx! {
        form {
            id: "luxor-control",
            onsubmit: move |_| {
                if let Ok(as_u8) = input().parse::<u8>() {
                    numbers.add(as_u8);
                }
                input.set("".to_string());
            },

            span {
                class: "padded clickable",
                onclick: move |_| {
                    locked.toggle();
                },

                if locked() {
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
                    modal
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
