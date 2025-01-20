use crate::components::{
    luxor::{DiskLuxorNumbers, LuxorNumbers},
    modal::{Button, Language, ModalProps, ModalType},
    Modal,
};
use dioxus::{logger::tracing, prelude::*};

#[component]
pub fn Controls() -> Element {
    let mut modal_state = use_signal::<ModalType>(|| None);
    let mut numbers = use_context::<DiskLuxorNumbers>();
    let mut locked = use_signal(|| true);
    let mut num = use_signal(|| "".to_string());

    let clear_nums = use_callback(move |_| {
        tracing::debug!("clearing numbers in luxor state");
        numbers.set(LuxorNumbers::default());
    });

    let cancel_modal = use_callback(move |_| {
        modal_state.set(None);
    });

    rsx! {
        if let Some(props) = modal_state() {
            Modal { ..props }
        }

        form {
            id: "luxor-control",
            onsubmit: move |_| {
                if let Ok(as_u8) = num().parse::<u8>() {
                    let mut curr = numbers.get();

                    if let Some(_) = curr.0.iter().position(|&n| n == as_u8) {
                        return;
                    } else {
                        curr.0.push(as_u8);
                        tracing::debug!("current numbers: {:?}", curr.0);
                        numbers.set(curr);
                    }

                }
                num.set("".to_string());
            },

            span {
                class: "padded clickable",
                onclick: move |_| {
                    // save fields
                    locked.set(!locked())
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
                value: "{num}",
                oninput: move |evt| {
                    evt.prevent_default();
                    num.set(evt.value());
                },
            }

            span {
                class: "padded clickable",
                title: "jelölések törlése",
                onclick: move |_| {
                    modal_state.set(Some(ModalProps {
                        lang: Some(Language::Hu),
                        buttons: vec![
                            (Button::Ok, Some(clear_nums)),
                            (Button::Cancel, None)
                        ],
                        children: rsx! {
                            "Törlöm az " strong{"összes"} " húzott számot"
                        },
                        cancel: cancel_modal,
                    }));
                },
                "♻️"
            }
        }
    }
}
