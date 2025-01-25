use dioxus::prelude::*;
pub use model::*;

mod model;
use crate::{components::shopping_list::models::Recipes, routes::Route};

/// Wrapper for keeping static resources
#[component]
pub fn OneShot() -> Element {
    let audio = use_signal(|| Audio::default());
    use_context_provider(|| audio);

    let recipes = use_signal(|| Recipes::default());
    use_context_provider(|| recipes);

    rsx! {
        Outlet::<Route> {}
    }
}
