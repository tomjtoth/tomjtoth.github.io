use dioxus::prelude::*;

use crate::components::arx_fatalis::models::CxRunes;

#[component]
pub(crate) fn Runes() -> Element {
    let runes = use_context::<CxRunes>();

    rsx! {
        div { id: "runes",
            {
                CxRunes::iter()
                    .map(|rune| {
                        let lowercase = rune.to_string().to_lowercase();
                        rsx! {
                            img {
                                key: "{rune}",
                                alt: "{rune}",
                                title: "{rune}",
                                class: "clickable",
                                draggable: false,
                                src: "/assets/arx/runes/{lowercase}.png",
                                onclick: {
                                    let mut queue = runes.clone();
                                    move |evt: Event<MouseData>| {
                                        evt.stop_propagation();
                                        queue.push(rune);
                                    }
                                },
                            }
                        }
                    })
            }
        }
    }
}
