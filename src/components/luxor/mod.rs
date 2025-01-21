use chrono::Utc;
use dioxus::{logger::tracing, prelude::*};
use serde::{Deserialize, Serialize};

mod controls;
mod fields;
mod nums_line;
use crate::{
    components::{
        modal::{Button, Language, ModalState, SigModalState},
        Body, Header,
    },
    routes::Route,
    utils::{url_sp, use_persistent, UsePersistent},
};
use controls::Controls;
use fields::{Field, Fields};
use nums_line::PickedNumsLine;

#[derive(Serialize, Deserialize, Clone)]
struct LuxorNumbers(Vec<u8>);
impl Default for LuxorNumbers {
    fn default() -> Self {
        LuxorNumbers(vec![])
    }
}

#[derive(Serialize, Deserialize, Clone)]
struct LuxorFields(Vec<Field>);
impl Default for LuxorFields {
    fn default() -> Self {
        LuxorFields(vec![Field::default()])
    }
}

impl LuxorFields {
    fn add_after(&mut self, id: u8) {
        let idx = self.0.iter().position(|&f| f.id == id).unwrap();
        let Field { order, .. } = self.0[idx];
        let mut max_id = 0;

        for field in self.0.iter_mut() {
            // move the rest to the right
            if field.order > order {
                field.order += 1;
            }

            // also make note on max_id
            if field.id > max_id {
                max_id = field.id;
            }
        }

        self.0.push(Field {
            id: max_id + 1,
            order: order + 1,
            rows: [[0; 5]; 5],
            imported_at: None,
        });
    }

    fn rm(&mut self, id: u8) {
        let idx = self.0.iter().position(|&f| f.id == id).unwrap();
        let Field { order, .. } = self.0[idx];

        // delete by id
        self.0.retain(|&f| f.id != id);

        // move the rest to the left
        for field in self.0.iter_mut() {
            if field.order > order {
                field.order -= 1;
            }
        }
    }

    fn push(&mut self, fields: Vec<[[u8; 5]; 5]>) {
        let base_id = self.0.iter().map(|f| f.id).max().unwrap() + 1;
        let base_order = self.0.len() as u8;

        for (idx, rows) in fields.into_iter().enumerate() {
            let idx_u8 = idx as u8;
            self.0.push(Field {
                id: base_id + idx_u8,
                order: base_order + idx_u8,
                rows,
                imported_at: Some(Utc::now().timestamp()),
            })
        }
    }
}

struct LuxorLocked(bool);

type DiskLuxorFields = UsePersistent<LuxorFields>;
type DiskLuxorNumbers = UsePersistent<LuxorNumbers>;
type SigLuxorLocked = Signal<LuxorLocked>;

#[component]
pub fn Luxor() -> Element {
    let numbers = use_persistent("luxor-numbers", || LuxorNumbers::default());
    let mut disk_fields = use_persistent("luxor-fields", || LuxorFields::default());
    let locked = use_signal(|| LuxorLocked(true));

    use_context_provider(|| numbers);
    use_context_provider(|| disk_fields);
    use_context_provider(|| locked);

    let mut modal = use_context::<SigModalState>();
    let navigator = use_navigator();

    let mut import_cb = move |arr: Vec<Option<u8>>| {
        let mut result = vec![];

        for (idx, res_u8) in arr.iter().enumerate() {
            // add a new "field"
            let field_rem = idx.rem_euclid(25);
            if field_rem == 0 {
                result.push([[0; 5]; 5]);
            }

            let fld_idx = idx / 25;
            let row_idx = field_rem / 5;
            let col_idx = idx.rem_euclid(5);

            result[fld_idx][row_idx][col_idx] = res_u8.unwrap();
        }

        let mut fields = disk_fields.get();
        fields.push(result);
        disk_fields.set(fields);

        tracing::debug!("imported from search params, navigating to Luxor");
        navigator.replace(Route::Luxor {});
    };

    use_effect(move || {
        if let Some(sp) = url_sp() {
            tracing::debug!("use_effect triggered");

            if let Some(comma_sep_vec_u8) = sp.get("import") {
                tracing::debug!("importing: {comma_sep_vec_u8}");

                let mut iterator_len = 0u16;
                let mut invalids = vec![];

                let vec_opt_u8 = comma_sep_vec_u8
                    .split(",")
                    .into_iter()
                    .map(|num_str| {
                        iterator_len += 1;

                        let res = if let Ok(parsed_u8) = num_str.parse::<u8>() {
                            if parsed_u8 <= 75 {
                                Some(parsed_u8)
                            } else {
                                None
                            }
                        } else {
                            None
                        };

                        if res.is_none() {
                            invalids.push(format!("\"{num_str}\" nem esett 0 és 75 közé"));
                        }

                        res
                    })
                    .collect::<Vec<Option<u8>>>();

                if iterator_len.rem_euclid(25) != 0 {
                    modal.set(ModalState {
                        prompt: Some(rsx! {
                            "25-ösével kell megadni a számokat! "
                            "A maradékot kipótolom bogarakkal. "
                            "Majd megszerkeszted a lakatra kattintva.."
                        }),
                        lang: Some(Language::Hu),
                        buttons: vec![(
                            Button::Ok,
                            Some(use_callback(move |_| {
                                tracing::debug!(
                                    "warned user of number % 25 != 0, calling import_cb"
                                );
                                import_cb(vec_opt_u8.clone());
                            })),
                        )],
                    });
                } else if invalids.len() != 0 {
                    let invalid_str = if invalids.len() > 1 {
                        format!("Az alábbiak nem jók: {}", invalids.join("; "))
                    } else {
                        format!("Ezt elrontottad: {}", invalids[0])
                    };

                    tracing::debug!(
                        "warning use with: \"{invalid_str}\", not proceeding with import"
                    );

                    modal.set(ModalState {
                        prompt: Some(rsx! {
                            p {
                                "{invalid_str}. Javítsd ki és próbáld újra!"
                            }
                        }),
                        lang: Some(Language::Hu),
                        ..Default::default()
                    });
                } else {
                    tracing::debug!("calling import_cb");
                    import_cb(vec_opt_u8);
                }
            }
        }
    });

    rsx! {
        Header {
            title: &"Luxor",
            lang: "hu",
            Controls {}
        }
        Body {
            lang: "hu",
            class: "luxor",
            PickedNumsLine {}
            Fields {}
        }
    }
}
