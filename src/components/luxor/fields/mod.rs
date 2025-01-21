use chrono::{TimeZone, Utc};
use dioxus::{logger::tracing, prelude::*};
use serde::{Deserialize, Serialize};
use table::Table;

mod table;
use crate::components::{
    luxor::{DiskLuxorFields, LuxorFields, SigLuxorLocked},
    modal::{Button, Language, ModalState, SigModalState},
};

type LuxorRow = [u8; 5];
type LuxorRows = [LuxorRow; 5];

#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct Field {
    id: u8,
    order: u8,
    rows: LuxorRows,
    imported_at: Option<i64>,
}

impl Default for Field {
    fn default() -> Self {
        Field {
            id: 0,
            order: 0,
            rows: [[0; 5]; 5],
            imported_at: None,
        }
    }
}

#[component]
pub fn Fields() -> Element {
    let mut modal = use_context::<SigModalState>();
    let mut fields = use_context::<DiskLuxorFields>();
    let curr_fields = fields.get().0;
    let fields_len = curr_fields.len() as u8;
    let deletable = curr_fields.len() > 1;

    let sig_locked = use_context::<SigLuxorLocked>();
    let locked = sig_locked.read().0;

    let li_class = format!("luxor{}", if locked { "" } else { " bordered" });

    let del_cb_outer = {
        let curr = curr_fields.clone();
        move |id, order| {
            tracing::debug!("del_cb_outer called with {id} and {order}");
            // TODO: actually remove field
            fields.set(LuxorFields(curr));
        }
    };

    rsx! {
        ul {
            class: "luxor",
            {curr_fields.into_iter().enumerate().map(move |(idx, field)| {
                let imported_span = if let Some(epoch) = field.imported_at {
                    let x = Utc.timestamp_opt(epoch, 0).unwrap();
                    let now = Utc::now();
                    let duration = now - x;

                    let seconds = duration.num_seconds();
                    let minutes = duration.num_minutes();
                    let hours = duration.num_hours();
                    let days = duration.num_days();

                    let time_string = if days > 0 {
                        format!("{} nappal korábbról", days)
                    } else if hours > 0 {
                        format!("{} órával korábbról", hours)
                    } else if minutes > 0 {
                        format!("{} perccel korábbról", minutes)
                    } else {
                        format!("{} másodperccel korábbról", seconds)
                    };
                    Some(time_string)
                } else {
                    None
                };

                let del_cb_inner = use_callback({
                    let outer_cb = del_cb_outer.clone();
                    move |_| {
                        tracing::debug!("del_cb_inner calling del_cb_outer");
                        let callable = outer_cb.clone();
                        callable(field.id, field.order);
                }});

                rsx! {
                    li {
                        key: "{field.id}",
                        class: li_class.clone(),

                        if !locked {
                            if let Some(text) = imported_span {
                                span {
                                    class: "padded",
                                    "{text}"
                                }
                            }
                            div {
                                if fields_len < u8::MAX  {

                                    span {
                                        class: "clickable padded",
                                        onclick: move |_| {
                                            // TODO: add new field;
                                        },
                                        "új mező ➕"
                                    }
                                } else {
                                    "max 255-öt meződ lehet"
                                }
                                if deletable {
                                    span {
                                        class: "clickable padded",
                                        onclick: move |_| {
                                            modal.set(ModalState{
                                                lang: Some(Language::Hu),
                                                prompt: Some(rsx! {
                                                    "asdf"
                                                }),
                                                buttons: vec![
                                                    (Button::Ok, Some(del_cb_inner)),
                                                    (Button::Cancel, None)
                                                ]
                                            })
                                        },
                                        "🚫 mező törlése"
                                    }
                                }
                            }
                        }

                        Table { idx }
                    }
                }
            })}
        }
    }
}
