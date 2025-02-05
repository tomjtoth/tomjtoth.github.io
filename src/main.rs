use dioxus::prelude::*;

mod components;
mod hooks;
mod routes;
mod utils;

use components::{arx_fatalis::RUNES, audio::AUDIO};

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // tripping initialization on 1st use
    AUDIO.read();
    hooks::BATMON.read();
    RUNES.read();

    rsx! {
        Router::<routes::Route> {}
    }
}
