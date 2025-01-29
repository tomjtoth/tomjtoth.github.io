use std::time::Duration;

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;

use strum::IntoEnumIterator;
use wasm_bindgen_futures::spawn_local;

use crate::components::{
    arx_fatalis::models::{runes::Rune, SigCastSpells, SigQueue},
    audio::SigAudio,
};

#[component]
pub fn Runes() -> Element {
    let queue = use_context::<SigQueue>();
    let audio = use_context::<SigAudio>();
    let spells = use_context::<SigCastSpells>();

    rsx! {
        div {
            id: "runes",
            {Rune::iter().map(|rune| {
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
                            let mut queue = queue.clone();
                            let mut spells = spells.clone();
                            move |evt: Event<MouseData>| {
                                evt.stop_propagation();
                                let paused = {
                                    let mut q = queue.write();
                                    q.push(rune)
                                };

                                if paused {
                                    spawn_local(async move {
                                        while let Some(delay) = {
                                            let mut q = queue.write();
                                            q.play(&audio.read())
                                        } {
                                            tracing::debug!("waiting {delay}ms to play next");
                                            sleep(Duration::from_millis(delay)).await;
                                        }

                                        let seq = {
                                            let mut q = queue.write();
                                            q.extract()
                                        };

                                        let mut s = spells.write();
                                        s.try_cast(seq, &audio.read());

                                    });
                                }
                            }
                        },
                    }
                }
            })}
        }
    }
}
