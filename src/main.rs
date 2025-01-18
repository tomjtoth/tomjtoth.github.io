mod components;
mod routes;
mod utils;
use dioxus::prelude::*;
use routes::Route;

const FAVICON: Asset = asset!("/assets/favicon.ico");
const MAIN_CSS: Asset = asset!("/assets/main.css");
const SIDEPANEL_CSS: Asset = asset!("/assets/sidepanel.css");
const HEADER_CSS: Asset = asset!("/assets/header.css");
const LOADER_CSS: Asset = asset!("/assets/loader.css");

#[derive(Clone, Copy)]
struct Title(Signal<String>);

impl std::fmt::Display for Title {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let st_title = Title(use_signal(|| "Rust + wasm".to_string()));
    use_context_provider(|| st_title);

    rsx! {
        document::Title { "{st_title}" }
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: MAIN_CSS }
        document::Link { rel: "stylesheet", href: SIDEPANEL_CSS }
        document::Link { rel: "stylesheet", href: HEADER_CSS }
        document::Link { rel: "stylesheet", href: LOADER_CSS }
        Router::<Route> {}
    }
}
