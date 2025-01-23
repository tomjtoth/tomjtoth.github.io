use chrono::{TimeZone, Utc};
use dioxus::{logger::tracing, prelude::*};

mod table;

use crate::components::{
    luxor::models::{SigFields, SigLocked},
    modal::{Button, Language, ModalState, SigModal},
};
use table::Table;

#[component]
pub fn Fields() -> Element {
    let mut modal = use_context::<SigModal>();
    let mut fields = use_context::<SigFields>();
    let fields_len = fields().len() as u8;
    let deletable = fields().len() > 1;

    let locked = use_context::<SigLocked>();

    let li_class = format!("luxor{}", if locked() { "" } else { " bordered" });

    let mut add_cb_outer = move |id| {
        tracing::debug!("add_cb_outer called with id: {id}");
        fields.write().add_after(id);
    };

    let del_cb_outer = {
        let mut fields = fields.clone();
        move |id| {
            tracing::debug!("del_cb_outer called with id: {id}");
            fields.write().rm(id);
        }
    };

    rsx! {
        ul {
            class: "luxor",
            {fields().into_iter().enumerate().map(move |(idx, field)| {
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
                        let mut callable = outer_cb.clone();
                        callable(field.id);
                }});

                rsx! {
                    li {
                        key: "{field.id}",
                        class: li_class.clone(),

                        if !locked() {
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
