use dioxus::prelude::*;
use qrcode::{render::svg, EcLevel, QrCode};

mod config;
pub mod model;

use crate::utils::get_pathname;
use config::LINKS;
pub use model::*;

#[component]
pub fn Sidepanel() -> Element {
    let mut sidepanel = use_context::<SigSidepanel>();
    let mut classes = vec!["border1-e"];

    if sidepanel().is_active() {
        classes.push("active");
    }

    rsx! {
        div {
            id: "sidepanel",
            class: classes.join(" "),
            onmouseleave: move |_| sidepanel.write().set(false),

            ul {
                li {
                    span {
                        class: "toggler nav-link clickable",
                        style: "float: right;",
                        onclick: move |_| sidepanel.write().set(false),
                        "×"
                    }
                }
                {LINKS.iter().map(|lnk| rsx! {
                    Link {
                        class: "nav-link",
                        to: lnk.to,
                        lang: lnk.lang,

                        "{lnk.label}"
                    }
                })}
            }
            {
                let code = QrCode::with_error_correction_level(
                    get_pathname().as_bytes(),
                    EcLevel::L
                ).unwrap();

                let image = code.render()
                    .max_dimensions(200,200)
                    .dark_color(svg::Color("var(--col-fg-0)"))
                    .light_color(svg::Color("var(--col-bg-0)"))
                    .build();

                rsx! {
                    svg {
                        id: "qr-code",
                        dangerous_inner_html: image,
                        onclick: |_| {
                            // navigator.clipboard.writeText(window.location.toString());
                        }
                    }
                }
            }
        }

        Outlet::<crate::routes::Route> {}
    }
}
