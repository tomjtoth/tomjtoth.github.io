use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::lyrics::{models::*, songs::Songs};

#[derive(Props, Clone, PartialEq)]
pub(crate) struct AlbumsProps {
    artist_idx: usize,
    albums: super::models::Albums,
}

#[component]
pub(crate) fn Albums(props: AlbumsProps) -> Element {
    rsx! {
        ul {
            {
                props
                    .albums
                    .iter()
                    .enumerate()
                    .map(|(album_idx, album)| {
                        let id = Rc::new(format!("{}-{}", props.artist_idx, album_idx));
                        let key = id.clone();
                        let clickable = props.albums.len() > 1;
                        let class = format!(
                            "padded bordered {}{}",
                            if clickable { "clickable" } else { "non-clickable" },
                            if props.albums.len() == 1 || ACTIVE.is(&id) {
                                " active"
                            } else {
                                ""
                            },
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
                                Songs {
                                    artist_idx: props.artist_idx,
                                    album_idx,
                                    songs: album.songs.clone(),
                                }

                            }
                        }
                    })
            }
        }
    }
}
