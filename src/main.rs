use dioxus::prelude::*;

mod components;
mod routes;
mod utils;

use components as c;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // init static resources
    c::audio::init();

    // read from localStorage
    c::sidepanel::init();
    c::luxor::init();
    c::shopping_list::init();

    rsx! {
        Router::<routes::Route> {}
    }
}
