use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::lyrics::{models::CxActive, songs::Songs};

#[derive(Props, Clone, PartialEq)]
pub struct AlbumsProps {
    artist_idx: usize,
    albums: super::models::Albums,
}

#[component]
pub fn Albums(props: AlbumsProps) -> Element {
    let active = use_context::<CxActive>();

    rsx! {
        ul {
            {
                props
                    .albums
                    .iter()
                    .enumerate()
                    .map(|(album_idx, album)| {
                        let key = Rc::new(format!("{}-{}", props.artist_idx, album_idx));
                        let clickable = props.albums.len() > 1;
                        let class = format!(
                            "padded bordered {}{}",
                            if clickable { "clickable" } else { "non-clickable" },
                            if props.albums.len() == 1 || active.is(&key) {
                                " active"
                            } else {
                                ""
                            },
                        );
                        rsx! {
                            li {
                                key,
                                class,
                                onclick: {
                                    let key = key.clone();
                                    let mut active = active.clone();
                                    move |evt: Event<MouseData>| {
                                        evt.stop_propagation();
                                        if clickable {
                                            active.toggle(&key);
                                        }
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
