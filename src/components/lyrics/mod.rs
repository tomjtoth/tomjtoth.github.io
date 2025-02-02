use artists::Artists;
use dioxus::prelude::*;

mod albums;
mod artists;
mod link;
mod models;
mod songs;

use crate::components::{body::Body, header::Header};

#[component]
pub fn Lyrics() -> Element {
    rsx! {
        Header { title: "Låttext", lang: "sv" }
        Body {
            p { style: "margin: 16px;",

                "The below songs are linked to Google Translate "
                "(or YouTube, when the lyrics are still missing)."
            }
            Artists {}
        }
    }
}
