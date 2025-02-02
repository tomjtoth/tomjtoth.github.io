use dioxus::prelude::*;

use crate::components::luxor::models::*;

#[derive(Props, PartialEq, Clone)]
pub struct TDProps {
    field_idx: usize,
    row_idx: usize,
    idx: usize,
    num: u8,
}

#[component]
pub fn TableData(props: TDProps) -> Element {
    let locked = use_context::<SigLocked>();

    let mut classes = vec![];

    let TDProps {
        field_idx,
        row_idx,
        idx,
        num,
    } = props;

    if locked() {
        classes.push("clickable");

        if row_idx == 1 && (1 <= idx && idx <= 3) {
            classes.push("border1-n");
        } else if row_idx == 3 && (1 <= idx && idx <= 3) {
            classes.push("border1-s");
        }

        if idx == 1 && (1 <= row_idx && row_idx <= 3) {
            classes.push("border1-w");
        } else if idx == 3 && (1 <= row_idx && row_idx <= 3) {
            classes.push("border1-e");
        }
    }

    if NUMBERS.has(num) {
        classes.push("picked");
    }

    rsx! {
        td {
            key: "{idx}", // order never changes
            class: classes.join(" "),
            onclick: move |evt| {
                evt.stop_propagation();
                if locked() && !NUMBERS.has(num) {
                    NUMBERS.add(num);
                }
            },

            if locked() {
                if num == 0 {
                    "🪲"
                } else {
                    "{num}"
                }
            } else {
                input {
                    class: "luxor-num",
                    r#type: "number",
                    min: 0,
                    max: 75,
                    value: num,
                    onchange: move |evt| {
                        if evt.value() != "" {
                            if let Ok(as_u8) = evt.value().parse::<u8>() {
                                if as_u8 <= 75 {
                                    FIELDS.update(field_idx, row_idx, idx, as_u8);
                                }
                            }
                        }
                    },
                }
            }
        }
    }
}
