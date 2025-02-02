use dioxus::prelude::*;

mod components;
mod hooks;
mod routes;
mod utils;

use components as c;
use hooks as h;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // init static resources
    c::modal::init();
    h::BatMon::init();

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
