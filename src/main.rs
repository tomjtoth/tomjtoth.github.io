mod components;
mod routes;
mod utils;
use components::shopping_list::TRecipes;
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
const VISITORS_CSS: Asset = asset!("/assets/visitors.css");
const SHOPPING_LIST_CSS: Asset = asset!("/assets/shopping-list.css");

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let recipes = use_signal::<TRecipes>(|| TRecipes(vec![]));
    use_context_provider(|| recipes);

    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "manifest", href: MANIFEST }
        document::Link { rel: "stylesheet", href: MAIN_CSS }
        document::Link { rel: "stylesheet", href: SIDEPANEL_CSS }
        document::Link { rel: "stylesheet", href: HEADER_CSS }
        document::Link { rel: "stylesheet", href: LOADER_CSS }
        document::Link { rel: "stylesheet", href: MODAL_CSS }
        document::Link { rel: "stylesheet", href: LUXOR_CSS }
        document::Link { rel: "stylesheet", href: SHOPPING_LIST_CSS }
        document::Link { rel: "stylesheet", href: VISITORS_CSS }
        Router::<Route> {}
    }
}
