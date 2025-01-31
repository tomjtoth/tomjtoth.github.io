use dioxus::prelude::*;

mod components;
mod hooks;
mod routes;
mod utils;

use components::{self as c, modal::ModalState};
use hooks as h;
use utils::init_ctx;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    init_ctx(|| ModalState::default());
    h::BatMon::init();

    // init static resources
    c::audio::init();

    // read from localStorage
    c::sidepanel::init();
    c::luxor::init();
    c::arx_fatalis::init();

    // also fetching from server
    c::lyrics::init();
    c::shopping_list::init();

    rsx! {
        Router::<routes::Route> {}
    }
}
