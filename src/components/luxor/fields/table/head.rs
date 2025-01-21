use dioxus::prelude::*;

#[component]
pub fn Head() -> Element {
    rsx! {
        thead {
            tr {
                {"LUXOR".chars().map(|char| {
                    rsx! {
                        th {
                            class: "luxor",
                            "{char}"
                        }
                    }
                })}
            }
        }
    }
}
