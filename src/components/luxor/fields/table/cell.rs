use dioxus::prelude::*;

use crate::components::luxor::{
    DiskLuxorFields, DiskLuxorNumbers, LuxorFields, LuxorNumbers, SigLuxorLocked,
};

#[derive(Props, PartialEq, Clone)]
pub struct CellProps {
    field_idx: usize,
    row_idx: usize,
    idx: usize,
    num: u8,
}

#[component]
pub fn Cell(props: CellProps) -> Element {
    let CellProps {
        field_idx,
        row_idx,
        idx,
        num,
    } = props;

    let mut disk_fields = use_context::<DiskLuxorFields>();
    let mut disk_numbers = use_context::<DiskLuxorNumbers>();
    let sig_locked = use_context::<SigLuxorLocked>();

    let mut numbers = disk_numbers.get().0;
    let locked = sig_locked.read().0;
    let mut classes = vec![];

    if locked {
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

    if in_vec(&numbers, &num) {
        classes.push("picked");
    }

    rsx! {
        td {
            key: "{idx}", // order never changes
            class: classes.join(" "),
            onclick:move |evt: Event<MouseData>| {
                evt.stop_propagation();
                if locked && !in_vec(&numbers, &num) {
                    numbers.push(num);
                    disk_numbers.set(LuxorNumbers(numbers.clone()));
                }
            },

            if locked {
                if num == 0 { "🪲" } else { "{num}" }
            } else {
                input {
                    class: "luxor-num",
                    type: "number",
                    min: 0,
                    max: 75,
                    value: num,
                    onchange: move |evt| {
                        if evt.value() != "" {
                            if let Ok(as_u8) = evt.value().parse::<u8>() {
                                if as_u8 <= 75 {
                                    let mut fields = disk_fields.get().0;
                                    fields[field_idx].rows[row_idx][idx] = as_u8;
                                    disk_fields.set(LuxorFields(fields));
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

fn in_vec(vec: &Vec<u8>, num: &u8) -> bool {
    vec.iter().position(|n| n == num).is_some()
}
