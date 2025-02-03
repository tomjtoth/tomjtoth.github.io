use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::lyrics::{models::*, songs::Songs};

#[derive(Props, Clone, PartialEq)]
pub(crate) struct AlbumsProps {
    artist_idx: usize,
}

#[component]
pub(crate) fn Albums(props: AlbumsProps) -> Element {
    let AlbumsProps { artist_idx } = props;
    let albums = &ARTISTS.get(artist_idx).unwrap().albums;

    rsx! {
        ul {
            {
                albums
                    .iter()
                    .enumerate()
                    .map(|(album_idx, album)| {
                        let id = Rc::new(format!("{}-{}", artist_idx, album_idx));
                        let key = id.clone();
                        let clickable = albums.len() > 1;
                        let class = format!(
                            "padded bordered {}{}",
                            if clickable { "clickable" } else { "non-clickable" },
                            if albums.len() == 1 || ACTIVE.is(&id) { " active" } else { "" },
                        );
                        rsx! {
                            li {
                                key,
                                class,
                                onclick: move |evt| {
                                    evt.stop_propagation();
                                    if clickable {
                                        ACTIVE.toggle(&id);
                                    }
                                },

                                if let Some(yyyy) = album.year {
                                    "{yyyy} - "
                                }
                                "{album.title}"
                                super::link::Link { url: album.url.clone() }
                                Songs { artist_idx, album_idx }

                            }
                        }
                    })
            }
        }
    }
}
