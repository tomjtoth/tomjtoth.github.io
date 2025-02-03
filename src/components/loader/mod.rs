use dioxus::prelude::*;

#[component]
pub(crate) fn Loader() -> Element {
    rsx! {
        div { class: "modal-blur",
            div { id: "loader" }
        }
    }
}
