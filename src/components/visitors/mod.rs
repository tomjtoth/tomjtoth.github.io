use chrono::{TimeDelta, Utc};
use config::VISITORS;
use dioxus::prelude::*;
use std::time::Duration;

mod calc;
mod config;
mod models;

use crate::components::header::Header;

#[component]
pub fn Visitors() -> Element {
    let mut now = Utc::now();
    let next = VISITORS
        .iter()
        .find(|vis| vis.arrival.is_some_and(|dt| dt > now));

    let mut text = use_signal::<Element>(|| calc::text(next, now));

    use_future(move || async move {
        if next.is_some() {
            let gloo1sec = Duration::from_secs(1);
            let chrono1sec = TimeDelta::seconds(1);
            loop {
                gloo_timers::future::sleep(gloo1sec).await;
                now = now.checked_add_signed(chrono1sec).unwrap();
                *text.write() = calc::text(next, now);
            }
        }
    });

    rsx! {
        Header { lang: "hu".to_string(), title: "látogatók", {text()} }
    }
}
