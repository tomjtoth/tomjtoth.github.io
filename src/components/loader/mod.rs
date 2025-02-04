use dioxus::prelude::*;

mod model;

use crate::routes::Route;
pub use model::*;

#[component]
pub(crate) fn Loader() -> Element {
    rsx! {
        if LOADER() {
            div {
                class: "modal-blur",
                div {
                    id: "loader"
                }
        }
    }

        Outlet::<Route> {}
    }
}
