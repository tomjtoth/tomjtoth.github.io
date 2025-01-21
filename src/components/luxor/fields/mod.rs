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
    pub id: u8,
    pub order: u8,
    pub rows: LuxorRows,
    pub imported_at: Option<i64>,
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
    let mut disk_fields = use_context::<DiskLuxorFields>();
    let mut fields = disk_fields.get();
    let fields_len = fields.0.len() as u8;
    let deletable = fields.0.len() > 1;

    let sig_locked = use_context::<SigLuxorLocked>();
    let locked = sig_locked.read().0;

    let li_class = format!("luxor{}", if locked { "" } else { " bordered" });

    let mut add_cb_outer = move |id| {
        tracing::debug!("add_cb_outer called with id: {id}");
        let mut fields = disk_fields.get();
        fields.add_after(id);
        disk_fields.set(fields);
    };

    let del_cb_outer = {
        let mut fields = fields.clone();
        move |id| {
            tracing::debug!("del_cb_outer called with id: {id}");
            fields.rm(id);
            disk_fields.set(fields);
        }
    };

    rsx! {
        ul {
            class: "luxor",
            {fields.0.into_iter().enumerate().map(move |(idx, field)| {
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

                let add_cb_inner =  move |_| {
                    tracing::debug!("add_cb_inner calling add_cb_outer");
                    add_cb_outer(field.id)
                };

                let del_cb_inner = use_callback({
                    let outer_cb = del_cb_outer.clone();
                    move |_| {
                        tracing::debug!("del_cb_inner calling del_cb_outer");
                        let callable = outer_cb.clone();
                        callable(field.id);
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
                                        onclick: add_cb_inner,
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
                                                    "Biztosan törlöd a mezőt?"
                                                }),
                                                buttons: vec![
                                                    (Button::Yes, Some(del_cb_inner)),
                                                    (Button::No, None)
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
