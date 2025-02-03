use std::rc::Rc;

use dioxus::prelude::*;
use urlencoding::encode;

use crate::components::lyrics::models::*;

#[derive(Props, Clone, PartialEq)]
pub(crate) struct AlbumsProps {
    artist_idx: usize,
    album_idx: usize,
}

#[component]
pub(crate) fn Songs(props: AlbumsProps) -> Element {
    let AlbumsProps {
        artist_idx,
        album_idx,
    } = props;
    let albums = &ARTISTS.get(artist_idx).unwrap().albums;
    let songs = &albums.get(album_idx).unwrap().songs;

    rsx! {
        ul {
            {
                songs
                    .iter()
                    .enumerate()
                    .map(|(song_idx, song)| {
                        let id = Rc::new(
                            format!("{}-{}-{}", artist_idx, album_idx, song_idx),
                        );
                        let key = id.clone();
                        let mut li_class = vec!["padded bordered"];
                        if songs.len() == 1 || ACTIVE.is(&id) {
                            li_class.push("active");
                        }
                        let has_siblings = songs.len() > 1;
                        let children = if let Some(lyrics) = song.lyrics.clone() {
                            if lyrics.starts_with("https://") {
                                li_class.push("clicking-not-allowed");
                                rsx! {
                                    super::link::Link { url: Some(lyrics) }
                                }
                            } else {
                                let trans = format!(
                                    "https://translate.google.com/?sl=sv&tl=en&text={}&op=translate",
                                    encode(&lyrics),
                                );
                                if has_siblings {
                                    li_class.push("clickable");
                                }
                                rsx! {
                                    super::link::Link { url: Some(trans) }
                                    p { class: "lyrics", onclick: |evt| evt.stop_propagation(), "{lyrics}" }
                                }
                            }
                        } else {
                            li_class.push("clicking-not-allowed");
                            let search = format!(
                                "https://www.youtube.com/results?search_query={}",
                                encode(
                                    &format!(
                                        "{} - Topic {}",
                                        ARTISTS.get(artist_idx).unwrap().name,
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
                                onclick: move |evt| {
                                    evt.stop_propagation();
                                    if li_class.contains(&"clickable") {
                                        ACTIVE.toggle(&id);
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
