use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::{
    loader::Loader,
    lyrics::{
        albums::Albums,
        models::{SigActive, SigArtists},
    },
};

#[component]
pub fn Artists() -> Element {
    let artists = use_context::<SigArtists>();
    let mut active = use_context::<SigActive>();

    rsx! {
        if artists.read().is_empty() {
            Loader {}
        } else {
            ul { lang: "sv", id: "lyrics",
                {
                    artists
                        .read()
                        .iter()
                        .enumerate()
                        .map(|(artist_idx, artist)| {
                            let key = Rc::new(artist_idx.to_string());
                            let class = format!(
                                "clickable padded bordered{}",
                                if active().is(&key) { " active" } else { "" },
                            );
                            rsx! {
                                li {
                                    key,
                                    class,
                                    onclick: {
                                        let key = key.clone();
                                        move |_| active.write().toggle(&key)
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
