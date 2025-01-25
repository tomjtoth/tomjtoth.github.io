use dioxus::{logger::tracing, prelude::*};

mod controls;
mod fields;
mod models;
mod nums_line;

pub use models::init;
use models::SigFields;

use crate::{
    components::{
        body::Body,
        header::Header,
        modal::{Button, Language, ModalState, SigModal},
    },
    routes::Route,
    utils::{init_ctx, url_sp},
};
use controls::Controls;
use nums_line::PickedNumsLine;

#[component]
pub fn Luxor() -> Element {
    init_ctx(|| true);
    let mut fields = use_context::<SigFields>();
    let mut modal = use_context::<SigModal>();
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

        fields.write().push(result);

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
                    .enumerate()
                    .map(|(idx, num_str)| {
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
                            invalids.push((idx + 1, num_str));
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
                    modal.set(ModalState {
                        prompt: Some(rsx! {
                            if invalids.len() > 1 {
                                p {
                                    "Az alábbiak nem 0 és 75 közötti számok:"
                                }

                                ol {
                                    style: "user-select: text",
                                    {invalids.iter().map(|(idx, inv)| {
                                        rsx! {
                                            li {
                                                value: "{idx}",
                                                "\"{inv}\""
                                            }
                                        }
                                    })}
                                }
                            } else {
                                p {
                                    "#{invalids[0].0} nem jó: "
                                    p {
                                        style: "user-select: text;",
                                        "\"{invalids[0].1}\"."
                                    }
                                }
                            }
                            p {
                                strong {
                                    "Javítsd ki és próbáld újra!"
                                }
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
            fields::Fields {}
        }
    }
}
