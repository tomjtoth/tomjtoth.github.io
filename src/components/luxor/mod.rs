use dioxus::{logger::tracing, prelude::*};

mod controls;
mod fields;
mod models;
mod nums_line;

use models::*;

use crate::{
    components::{body::Body, header::Header, modal::*},
    routes::Route,
    utils::get_search_params,
};
use controls::Controls;
use nums_line::PickedNumsLine;

#[component]
pub(crate) fn Luxor() -> Element {
    let navigator = use_navigator();

    let import_cb = move |arr: Vec<Option<u8>>| {
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

        FIELDS.import(result);

        tracing::debug!("imported from search params, navigating to Luxor");
        navigator.replace(Route::Luxor {});
    };

    use_effect(move || {
        if let Some(sp) = get_search_params() {
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
                    MODAL
                        .lang(Language::Hu)
                        .buttons(vec![(
                            Button::Ok,
                            Some(use_callback({
                                let import_cb = import_cb.clone();
                                move |_| {
                                    tracing::debug!(
                                        "warned user of number % 25 != 0, calling import_cb"
                                    );
                                    import_cb(vec_opt_u8.clone());
                                }
                            })),
                        )])
                        .prompt(rsx! {
                            "25-ösével kell megadni a számokat! "
                            "A maradékot kipótolom bogarakkal. "
                            "Majd megszerkeszted a lakatra kattintva.."
                        })
                } else if invalids.len() != 0 {
                    MODAL.lang(Language::Hu).prompt(rsx! {
                        if invalids.len() > 1 {
                            p { "Az alábbiak nem 0 és 75 közötti számok:" }

                            ol { style: "user-select: text",
                                {
                                    invalids
                                        .iter()
                                        .map(|(idx, inv)| {
                                            rsx! {
                                                li { value: "{idx}", "\"{inv}\"" }
                                            }
                                        })
                                }
                            }
                        } else {
                            p {
                                "#{invalids[0].0} nem jó: "
                                p { style: "user-select: text;", "\"{invalids[0].1}\"." }
                            }
                        }
                        p {
                            strong { "Javítsd ki és próbáld újra!" }
                        }
                    })
                } else {
                    tracing::debug!("calling import_cb");
                    import_cb(vec_opt_u8);
                }
            }
        }
    });

    rsx! {
        Header { title: "Luxor", lang: "hu", Controls {} }
        Body { lang: "hu", class: "luxor",
            PickedNumsLine {}
            fields::Fields {}
        }
    }
}
