use dioxus::prelude::*;

mod components;
mod hooks;
mod routes;
mod utils;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // tripping initialization on 1st use
    components::audio::AUDIO.with(|_| {});
    hooks::BatMon::init();

    rsx! {
        Router::<routes::Route> {}
    }
}
