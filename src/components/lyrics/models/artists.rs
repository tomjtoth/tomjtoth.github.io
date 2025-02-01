use std::{cmp::Ordering, rc::Rc};

use crate::utils::to_yaml;
use dioxus::prelude::*;

use super::{albums::Albums, parser, Album, Song};

#[derive(Clone, PartialEq)]
pub struct Artist {
    pub name: String,
    pub url: Option<String>,
    pub albums: Albums,
}

type Inner = Vec<Artist>;
#[derive(Clone)]
pub struct CxArtists {
    pub inner: Signal<Inner>,
}

impl CxArtists {
    pub fn init() {
        let mut artists = CxArtists {
            inner: use_signal(|| vec![]),
        };
        use_context_provider(|| artists.clone());

        use_future(move || async move {
            let pre_parsed = to_yaml::<parser::Artists>(asset!("/assets/lyrics.yaml")).await;

            let mut parsed: Vec<Artist> = pre_parsed
                .into_iter()
                .map(|(name, artist)| {
                    let mut albums = artist
                        .albums
                        .into_iter()
                        .map(|(title, alb)| {
                            let songs = Rc::new(Vec::from_iter(
                                alb.songs
                                    .into_iter()
                                    .map(|(title, lyrics)| Song { title, lyrics }),
                            ));

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
                        albums: Rc::new(albums),
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

            let mut w = artists.inner.write();
            w.append(&mut parsed);
        });
    }

    pub fn is_empty(&self) -> bool {
        let r = self.inner.read();
        r.is_empty()
    }

    // TODO: make inner private again and make passing r.iter() work
    // pub fn map(&self) -> std::vec::IntoIter<Artist> {
    //     let r = { self.inner.read() };
    //     let x = r.into_iter();
    //     x
    // }

    pub fn get(&self, index: usize) -> Artist {
        let r = self.inner.read();
        let a = r.get(index).unwrap();
        a.clone()
    }
}
