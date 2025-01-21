mod components;
mod routes;
mod utils;
use components::visitors::TVisitors;
use dioxus::prelude::*;
use routes::Route;

const FAVICON: Asset = asset!("/public/favicon.png");
const MANIFEST: Asset = asset!("/public/manifest.json");
const MAIN_CSS: Asset = asset!("/assets/main.css");
const SIDEPANEL_CSS: Asset = asset!("/assets/sidepanel.css");
const HEADER_CSS: Asset = asset!("/assets/header.css");
const LOADER_CSS: Asset = asset!("/assets/loader.css");
const MODAL_CSS: Asset = asset!("/assets/modal.css");
const LUXOR_CSS: Asset = asset!("/assets/luxor.css");

#[derive(Clone, Copy)]
struct Title(Signal<String>);

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let title = Title(use_signal(|| "Rust + wasm".to_string()));
    use_context_provider(|| title);

    let visitors = use_signal::<TVisitors>(|| vec![]);
    use_context_provider(|| visitors);

    rsx! {
        document::Title { "{title.0}" }
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: MAIN_CSS }
        document::Link { rel: "stylesheet", href: SIDEPANEL_CSS }
        document::Link { rel: "stylesheet", href: HEADER_CSS }
        document::Link { rel: "stylesheet", href: LOADER_CSS }
        document::Link { rel: "stylesheet", href: MODAL_CSS }
        document::Link { rel: "stylesheet", href: LUXOR_CSS }
        document::Link { rel: "manifest", href: MANIFEST }
        Router::<Route> {}
    }
}
