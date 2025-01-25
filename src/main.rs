use components::{audio::model::Audio, sidepanel::model::Sidepanel};
use dioxus::prelude::*;

mod components;
mod routes;
mod utils;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // read from localStorage
    Sidepanel::init();
    components::shopping_list::models::init();
    components::luxor::models::init();
    // init static resources
    Audio::init();

    rsx! {
        Router::<routes::Route> {}
    }
}
