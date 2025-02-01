use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::{
    loader::Loader,
    lyrics::{
        albums::Albums,
        models::{CxActive, CxArtists},
    },
};

#[component]
pub fn Artists() -> Element {
    let artists = use_context::<CxArtists>();
    let active = use_context::<CxActive>();

    rsx! {
        if artists.is_empty() {
            Loader {}
        } else {
            ul { lang: "sv", id: "lyrics",
                {
                    artists
                        .iter_enum()
                        .map(|(artist_idx, artist)| {
                            let key = Rc::new(artist_idx.to_string());
                            let class = format!(
                                "clickable padded bordered{}",
                                if active.is(&key) { " active" } else { "" },
                            );
                            rsx! {
                                li {
                                    key,
                                    class,
                                    onclick: {
                                        let key = key.clone();
                                        let mut active = active.clone();
                                        move |_| active.toggle(&key)
                                    },
                                    "{artist.name}"
                                    super::link::Link { url: artist.url.clone() }
                                    Albums { artist_idx, albums: artist.albums.clone() }
                                }
                            }
                        })
                }
            }
        }
    }
}
