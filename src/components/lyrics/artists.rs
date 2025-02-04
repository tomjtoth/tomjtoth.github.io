use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::{
    loader::*,
    lyrics::{albums::Albums, models::*},
};

#[component]
pub(crate) fn Artists() -> Element {
    if ARTISTS.is_empty() {
        LOADER.show();
    }

    use_future(|| async {
        if ARTISTS.is_empty() {
            ARTISTS.init().await;
            LOADER.hide().await;
        }
    });

    rsx! {
        ul { lang: "sv", id: "lyrics",
            {
                ARTISTS
                    .iter()
                    .enumerate()
                    .map(|(artist_idx, artist)| {
                        let id = Rc::new(artist_idx.to_string());
                        let key = id.clone();
                        let class = format!(
                            "clickable padded bordered{}",
                            if ACTIVE.is(&id) { " active" } else { "" },
                        );
                        rsx! {
                            li { key, class, onclick: move |_| ACTIVE.toggle(&id),
                                "{artist.name}"
                                super::link::Link { url: artist.url.clone() }
                                Albums { artist_idx }
                            }
                        }
                    })
            }
        }
    }
}
