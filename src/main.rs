mod components;
mod routes;
mod utils;
use components::shopping_list::TRecipes;
use dioxus::prelude::*;
use routes::Route;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let recipes = use_signal::<TRecipes>(|| TRecipes(vec![]));
    use_context_provider(|| recipes);

    rsx! {
        Router::<Route> {}
    }
}
