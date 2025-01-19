use crate::components::{
    luxor::{LuxorState, LuxorType},
    modal::{Button, Language, ModalProps, ModalType},
    Modal,
};
use dioxus::{logger::tracing, prelude::*};

#[component]
pub fn Controls() -> Element {
    let mut locked = use_signal(|| true);
    let mut luxor_state = use_context::<LuxorType>();
    let mut num = use_signal(|| "".to_string());
    let mut modal_state = use_signal::<ModalType>(|| None);

    let clear_nums = use_callback(move |_| {
        tracing::debug!("clearing numbers in luxor state");
        let curr = luxor_state.get();

        luxor_state.set(LuxorState {
            numbers: vec![],
            fields: curr.fields,
        });
    });

    let cancel_modal = use_callback(move |_| {
        modal_state.set(None);
    });

    rsx! {
        if let Some(modal) = modal_state() {
            Modal { ..modal }
        }

        form {
            id: "luxor-control",
            onsubmit: move |_| {
                if let Ok(as_u8) = num().parse::<u8>() {
                    let mut curr = luxor_state.get();

                    if let Some(_) = curr.numbers.iter().position(|&n| n == as_u8) {
                        return;
                    } else {
                        curr.numbers.push(as_u8);
                    }

                    luxor_state.set(LuxorState{
                        numbers: curr.numbers,
                        fields: curr.fields,
                    })
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
                    num.set(evt.value())

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
