use dioxus::prelude::*;

mod components;
mod routes;
mod utils;

use routes::Route;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    rsx! {
        Router::<Route> {}
    }
}
