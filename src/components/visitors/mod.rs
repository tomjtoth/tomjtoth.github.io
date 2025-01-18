use super::Header;
use crate::components::Body;
use crate::utils::fetch_yaml;
use dioxus;
use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
struct Visitor {
    name: String,
    arrival: String,
    departure: Option<String>,
}

#[component]
pub fn Visitors() -> Element {
    let mut visits = use_signal::<Vec<Visitor>>(|| vec![]);

    use_future(move || async move {
        if visits.len() == 0 {
            let fallback: Vec<Visitor> = vec![];
            visits.set(fetch_yaml("/visitors.yaml", fallback).await)
        }
    });

    rsx! {
        Header {
            lang: "hu".to_string(),
            title: &"látogatók",

        }
        Body {
            p {
                "The following visits are known:"
                {visits.iter().map( |v| rsx!{ "{v.name} {v.arrival}" })}
            }
        }
    }
}
