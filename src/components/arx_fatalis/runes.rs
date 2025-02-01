use std::time::Duration;

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;

use strum::IntoEnumIterator;
use wasm_bindgen_futures::spawn_local;

use crate::components::{
    arx_fatalis::models::{runes::Rune, CxQueue, SigCastSpells},
    audio::SigAudio,
};

#[component]
pub fn Runes() -> Element {
    let queue = use_context::<CxQueue>();
    let audio = use_context::<SigAudio>();
    let spells = use_context::<SigCastSpells>();
    // TODO: move spawn_local into a restartable use_future within CxQueue

    rsx! {

        div { id: "runes",
            {
                Rune::iter()
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
                                    let mut queue = queue.clone();
                                    let mut spells = spells.clone();
                                    move |evt: Event<MouseData>| {
                                        evt.stop_propagation();
                                        let paused = queue.push(rune);
                                        if paused {
                                            spawn_local({
                                                let mut queue = queue.clone();
                                                async move {
                                                    while let Some(delay) = queue.play(&audio.read()) {
                                                        tracing::debug!("waiting {delay}ms to play next");
                                                        sleep(Duration::from_millis(delay)).await;
                                                    }
                                                    let seq = queue.extract();
                                                    let mut s = spells.write();
                                                    s.try_cast(seq, &audio.read());
                                                }
                                            });
                                        }
                                    }
                                },
                            }
                        }
                    })
            }
        }
    }
}
