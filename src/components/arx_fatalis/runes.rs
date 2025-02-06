use dioxus::prelude::*;

use crate::components::{arx_fatalis::models::*, loader::*};

#[component]
pub(crate) fn Runes() -> Element {
    let initialized = RUNES.cache_checked();

    use_effect(move || {
        if !initialized {
            LOADER.show();
        }
    });

    use_future(move || async move {
        RUNES.check_cache().await;
        LOADER.hide();
    });

    rsx! {
        if initialized {

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
}
