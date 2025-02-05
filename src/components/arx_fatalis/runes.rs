use dioxus::prelude::*;

use crate::components::arx_fatalis::models::*;

#[component]
pub(crate) fn Runes() -> Element {
    rsx! {
        div { id: "runes",
            {
                GsRunes::iter()
                    .map(|rune| {
                        let src = rune.src_png();
                        rsx! {
                            img {
                                key: "{rune}",
                                alt: "{rune}",
                                title: "{rune}",
                                class: "clickable",
                                draggable: false,
                                src,
                                onclick: move |evt| {
                                    evt.stop_propagation();
                                    RUNES.push(rune);
                                },
                            }
                        }
                    })
            }
        }
    }
}
