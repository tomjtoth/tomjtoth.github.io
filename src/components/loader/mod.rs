use dioxus::prelude::*;

use crate::routes::Route;

mod model;

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
