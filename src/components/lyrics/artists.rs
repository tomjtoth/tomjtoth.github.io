use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::{
    loader::Loader,
    lyrics::{albums::Albums, models::*},
};

#[component]
pub fn Artists() -> Element {
    let artists = use_context::<CxArtists>();

    rsx! {
        if artists.is_empty() {
            Loader {}
        } else {
            ul { lang: "sv", id: "lyrics",
                {
                    artists
                        .iter_enum()
                        .map(|(artist_idx, artist)| {
                            let id = Rc::new(artist_idx.to_string());
                            let class = format!(
                                "clickable padded bordered{}",
                                if ACTIVE.is(&id) { " active" } else { "" },
                            );
                            rsx! {
                                li { key: id.clone(), class, onclick: move |_| ACTIVE.toggle(&id),
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
