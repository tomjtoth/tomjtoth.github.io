use super::Header;
use crate::components::Body;
use crate::utils::to_yaml;
use dioxus;
use dioxus::prelude::*;
use serde::Deserialize;

type DTZ = String; //DateTime<Utc>;

static VISITORS_YAML: Asset = asset!("/assets/visitors.yaml");

#[derive(PartialEq, Deserialize, Debug, Clone)]
pub struct Visitor {
    name: String,
    arrival: DTZ,
    departure: Option<DTZ>,
}

pub type TVisitors = Vec<Visitor>;
pub type SVisitors = Signal<TVisitors>;

#[component]
pub fn Visitors() -> Element {
    let mut visitors = use_context::<SVisitors>();

    use_future(move || async move {
        if visitors.len() == 0 {
            visitors.set(to_yaml(VISITORS_YAML).await);
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
                {visitors.iter().map( |v| rsx!{ "{v.name} {v.arrival}" })}
            }
        }
    }
}
