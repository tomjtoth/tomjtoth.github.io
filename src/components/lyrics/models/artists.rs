use std::cmp::Ordering;

use dioxus::prelude::*;

use crate::utils::{from_cache, to_yaml};

use super::{albums::Albums, parser, Album, Song};

pub(crate) struct Artist {
    pub(crate) name: String,
    pub(crate) url: Option<String>,
    pub(crate) albums: Albums,
}

type Artists = Vec<Artist>;
type GsArtists = GlobalSignal<Artists>;

pub(crate) static ARTISTS: GsArtists = GlobalSignal::new(|| vec![]);

pub(crate) trait TrArtists {
    async fn init(&self);
}

impl TrArtists for GsArtists {
    async fn init(&self) {
        let mut url = asset!("/assets/lyrics.yaml").to_string();
        if let Ok(Some(cached)) = from_cache(&url).await {
            url = cached
        }
        let pre_parsed = to_yaml::<parser::Artists>(&url).await;

        let mut parsed: Vec<Artist> = pre_parsed
            .into_iter()
            .map(|(name, artist)| {
                let mut albums = artist
                    .albums
                    .into_iter()
                    .map(|(title, alb)| {
                        let songs = Vec::from_iter(
                            alb.songs
                                .into_iter()
                                .map(|(title, lyrics)| Song { title, lyrics }),
                        );

                        Album {
                            year: alb.year,
                            title: if title == "~" {
                                "mix".to_string()
                            } else {
                                title
                            },
                            songs,
                            url: alb.url,
                        }
                    })
                    .collect::<Vec<Album>>();

                albums.sort_by(|a, b| {
                    if a.year.is_none() {
                        Ordering::Less
                    } else if b.year.is_none() {
                        Ordering::Greater
                    }
                    // this shouldn't happen
                    else if a.year.is_none() && b.year.is_none() {
                        Ordering::Equal
                    } else {
                        // ordering by year
                        let a_y = a.year.expect("");
                        let b_y = b.year.expect("");
                        if a_y > b_y {
                            Ordering::Less
                        } else if a_y < b_y {
                            Ordering::Greater
                        }
                        // lexically ordering within the same year
                        else {
                            let a_lower = a.title.to_lowercase();
                            let b_lower = b.title.to_lowercase();
                            if a_lower < b_lower {
                                Ordering::Less
                            } else if a_lower > b_lower {
                                Ordering::Greater
                            } else {
                                Ordering::Equal
                            }
                        }
                    }
                });

                Artist {
                    name,
                    url: artist.url,
                    albums,
                }
            })
            .collect();

        parsed.sort_by(|a, b| {
            let a_lower = a.name.to_lowercase();
            let b_lower = b.name.to_lowercase();
            if a_lower < b_lower {
                Ordering::Less
            } else if a_lower > b_lower {
                Ordering::Greater
            } else {
                Ordering::Equal
            }
        });

        self.with_mut(|w| w.append(&mut parsed))
    }
}
