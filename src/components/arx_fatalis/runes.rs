use dioxus::prelude::*;
use strum::IntoEnumIterator;

use crate::components::{arx_fatalis::models::runes::Rune, audio::SigAudio};

#[component]
pub fn Runes() -> Element {
    let audio = use_context::<SigAudio>();

    rsx! {
        div {
            id: "runes",
            {Rune::iter().map(|rune| {
                let lowercase = rune.to_string().to_lowercase();
                let snd = rune.as_src();

                rsx! {
                    img {
                        key: "{rune}",
                        alt: "{rune}",
                        title: "{rune}",
                        class: "clickable",
                        src: "/assets/arx/runes/{lowercase}.png",
                        onclick: move |evt| {
                            evt.stop_propagation();
                            audio.read().play(&snd);
                        },
                    }
                }
            })}
        }
    }
}
