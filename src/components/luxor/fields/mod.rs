use chrono::{TimeZone, Utc};
use dioxus::{logger::tracing, prelude::*};

mod table;

use crate::components::{luxor::models::*, modal::*};
use table::Table;

#[component]
pub fn Fields() -> Element {
    let fields_len = FIELDS.len() as u8;
    let deletable = FIELDS.len() > 1;

    let li_class = format!("luxor{}", if LOCK.status() { "" } else { " bordered" });

    let add_cb_outer = {
        move |id| {
            tracing::debug!("add_cb_outer called with id: {id}");
            FIELDS.add_after(id);
        }
    };

    let del_cb_outer = {
        move |id| {
            tracing::debug!("del_cb_outer called with id: {id}");
            FIELDS.rm(id);
        }
    };

    rsx! {
        ul { class: "luxor",
            {
                FIELDS
                    .iter()
                    .enumerate()
                    .map(move |(idx, field)| {
                        let field = field.clone();
                        let add_cb_inner = move |_| {
                            tracing::debug!("add_cb_inner calling add_cb_outer");
                            add_cb_outer(field.id)
                        };
                        let del_cb_inner = use_callback(move |_| {
                            tracing::debug!("del_cb_inner calling del_cb_outer");
                            del_cb_outer(field.id);
                        });
                        rsx! {
                            li { key: "{field.id}", class: li_class.clone(),
                                if !LOCK.status() {
                                    if let Some(text) = imported(&field) {
                                        span { class: "padded", "{text}" }
                                    }
                                    div {
                                        if fields_len < u8::MAX {
                                            span { class: "clickable padded", onclick: add_cb_inner, "új mező ➕" }
                                        } else {
                                            "max 255-öt meződ lehet"
                                        }
                                        if deletable {
                                            span {
                                                class: "clickable padded",
                                                onclick: move |_| {
                                                    MODAL
                                                        .lang(Language::Hu)
                                                        .buttons(vec![(Button::Yes, Some(del_cb_inner)), (Button::No, None)])
                                                        .prompt(rsx! { "Biztosan törlöd a mezőt?" })
                                                },
                                                "🚫 mező törlése"
                                            }
                                        }
                                    }
                                }

                                Table { idx }
                            }
                        }
                    })
            }
        }
    }
}

fn imported(field: &Field) -> Option<String> {
    if let Some(epoch) = field.imported_at {
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
    }
}
