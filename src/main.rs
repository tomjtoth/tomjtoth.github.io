use dioxus::prelude::*;

mod components;
mod hooks;
mod routes;
mod utils;

use components::{arx_fatalis::RUNES, audio::AUDIO};
use hooks::BATMON;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // tripping async initializations on 1st read
    AUDIO.read();
    BATMON.read();
    RUNES.read();

    rsx! {
        Router::<routes::Route> {}
    }
}
