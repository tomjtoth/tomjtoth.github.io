use std::rc::Rc;

use dioxus::prelude::*;

use crate::components::lyrics::{models::SigActive, songs::Songs};

#[derive(Props, Clone, PartialEq)]
pub struct AlbumsProps {
    artist_idx: usize,
    albums: super::models::Albums,
}

#[component]
pub fn Albums(props: AlbumsProps) -> Element {
    let mut active = use_context::<SigActive>();

    rsx! {
        ul {
            {props.albums.iter().enumerate().map(|(album_idx, album)| {
                let key = Rc::new(format!("{}-{}", props.artist_idx, album_idx));
                let clickable = props.albums.len() > 1;

                let class = format!("padded bordered {}{}",
                    if clickable { "clickable" } else { "non-clickable" },
                    if props.albums.len() == 1 || active().is(&key) {" active" } else {""}
                );

                rsx! {
                    li {
                        key,
                        class,
                        onclick: {
                            let key = key.clone();
                            move |evt:Event<MouseData>| {
                                evt.stop_propagation();
                                if clickable {
                                    active.write().toggle(&key);
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
            })}
        }
    }
}

//       {albums.map(({ title, year, url, songs }, albumIdx) => {
//         const id = [artistIdx, albumIdx].join("-");

//         return (
//           <li
//             key={albumIdx}
//             {...{
//               id,
//               className: `${
//                 albums.length > 1 ? "clickable " : "non-clickable "
//               }padded bordered${
//                 albums.length === 1 || (active as Active).includes(id)
//                   ? " active"
//                   : ""
//               }`,
//             }}
//           >
//             {year && `${year} - `}
//             {title === "null" ? "mix" : title}
//             <Logo {...{ url }} />
//             <Songs {...{ artistIdx, albumIdx, songs }} />
//           </li>
//         );
//       })}
//   );
// }
