use crate::components::{
    luxor::models::{SigLocked, SigNumbers},
    modal::{Button, Language, ModalState, SigModal},
};
use dioxus::{logger::tracing, prelude::*};

#[component]
pub fn Controls() -> Element {
    let mut modal = use_context::<SigModal>();
    let mut numbers = use_context::<SigNumbers>();
    let mut locked = use_context::<SigLocked>();
    let mut input = use_signal(|| "".to_string());

    let clear_nums = use_callback(move |_| {
        tracing::debug!("clearing numbers in luxor state");
        numbers.write().clear();
    });

    rsx! {
        form {
            id: "luxor-control",
            onsubmit: move |_| {
                if let Ok(as_u8) = input().parse::<u8>() {
                    numbers.write().add(as_u8);
                }
                input.set("".to_string());
            },

            span {
                class: "padded clickable",
                onclick: move |_| {
                    locked.toggle();
                },

                if locked() {"🔒"} else {"🔓"}
            }

            input {
                id: "luxor-adder",
                type: "number",
                class: "bordered",
                max: 75,
                min: 0,
                autocomplete: "off",
                autofocus: "on",
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
                    modal.set(ModalState {
                        lang: Some(Language::Hu),
                        buttons: vec![(Button::Ok, Some(clear_nums)), (Button::Cancel, None)],
                        prompt: Some(rsx! {
                            "Törlöm az " strong{"összes"} " húzott számot"
                        }),
                    });
                },
                "♻️"
            }
        }
    }
}
