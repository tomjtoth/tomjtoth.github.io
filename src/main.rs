use dioxus::prelude::*;

mod components;
mod hooks;
mod routes;
mod utils;

use components::audio::AUDIO;
use hooks as h;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    {
        let _trip_init = AUDIO.read();
    }

    // init static resources
    h::BatMon::init();

    rsx! {
        Router::<routes::Route> {}
    }
}
