use dioxus::prelude::*;

#[component]
pub(crate) fn Loader() -> Element {
    rsx! {
        div { id: "modal-blur",
            div { id: "loader" }
        }
    }
}
