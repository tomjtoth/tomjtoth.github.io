use std::rc::Rc;

use dioxus::prelude::*;
use urlencoding::encode;

use crate::components::lyrics::models::{CxActive, CxArtists};

#[derive(Props, Clone, PartialEq)]
pub struct AlbumsProps {
    artist_idx: usize,
    album_idx: usize,
    songs: super::models::Songs,
}

#[component]
pub fn Songs(props: AlbumsProps) -> Element {
    let active = use_context::<CxActive>();
    let artists = use_context::<CxArtists>();

    rsx! {
        ul {
            {
                props
                    .songs
                    .iter()
                    .enumerate()
                    .map(|(song_idx, song)| {
                        let key = Rc::new(
                            format!("{}-{}-{}", props.artist_idx, props.album_idx, song_idx),
                        );
                        let mut li_class = vec!["padded bordered"];
                        if props.songs.len() == 1 || active.is(&key) {
                            li_class.push("active");
                        }
                        let clickable = props.songs.len() > 1;
                        let children = if let Some(lyrics) = song.lyrics.clone() {
                            if lyrics.starts_with("https://") {
                                li_class.push("missing-lyrics");
                                li_class.push("non-clickable");
                                rsx! {
                                    super::link::Link { url: Some(lyrics) }
                                }
                            } else {
                                let trans = format!(
                                    "https://translate.google.com/?sl=sv&tl=en&text={}&op=translate",
                                    encode(&lyrics),
                                );
                                if clickable {
                                    li_class.push("clickable");
                                }
                                rsx! {
                                    super::link::Link { url: Some(trans) }
                                    p { class: "lyrics", onclick: |evt| evt.stop_propagation(), "{lyrics}" }
                                }
                            }
                        } else {
                            li_class.push("missing-lyrics");
                            li_class.push("non-clickable");
                            let search = format!(
                                "https://www.youtube.com/results?search_query={}",
                                encode(
                                    &format!(
                                        "{} - Topic {}",
                                        artists.get(props.artist_idx).name,
                                        song.title,
                                    ),
                                ),
                            );
                            rsx! {
                                super::link::Link { url: Some(search) }
                            }
                        };
                        rsx! {
                            li {
                                key,
                                class: li_class.join(" "),
                                onclick: {
                                    let key = key.clone();
                                    let mut active = active.clone();
                                    move |evt: Event<MouseData>| {
                                        evt.stop_propagation();
                                        if !li_class.contains(&"non-clickable") {
                                            active.toggle(&key);
                                        }
                                    }
                                },

                                "{song.title}"
                                {children}
                            }
                        }
                    })
            }
        }
    }
}

// const searchYouTube = (artist: string, song: string) =>
//   `https://www.youtube.com/results?search_query=${encodeURIComponent(
//     `${artist} - Topic ${song}`
//   )}`;

// const translate = (lyrics: string) =>
//   ``;

//   return (
//     <ul>
//       {songs.map(({ title, lyrics }, songIdx) => {
//         const id = [artistIdx, albumIdx, songIdx].join("-");

//         let className = `padded bordered${
//           songs.length === 1 || (active as Active).includes(id) ? " active" : ""
//         }`;

//         return (
//           <li key={songIdx} {...{ className, id }}>
//             {title}
//             {link}
//             {!lyrics.startsWith("http") && <p className="lyrics">{lyrics}</p>}
//           </li>
//         );
//       })}
//     </ul>
//   );
// }
