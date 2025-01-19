use super::Header;
use crate::components::Body;
use crate::utils::to_yaml;
use dioxus;
use dioxus::prelude::*;
use serde::Deserialize;

type DTZ = String; //DateTime<Utc>;

static VISITORS_YAML: Asset = asset!("/assets/visitors.yaml");

#[derive(PartialEq, Deserialize, Debug, Clone)]
struct Visitor {
    name: String,
    arrival: DTZ,
    departure: Option<DTZ>,
}

#[component]
pub fn Visitors() -> Element {
    let mut visits = use_signal::<Vec<Visitor>>(|| vec![]);

    use_future(move || async move {
        if visits.len() == 0 {
            visits.set(to_yaml(VISITORS_YAML).await);
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
