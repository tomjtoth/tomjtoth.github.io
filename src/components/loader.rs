use dioxus::prelude::*;

#[component]
pub fn Loader() -> Element {
    rsx! {
        div { id: "modal-blur",
            div  { id: "loader" }
        }
    }
}
