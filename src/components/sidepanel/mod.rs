use dioxus::prelude::*;
use qrcode::{render::svg, EcLevel, QrCode};

mod model;

use crate::routes::Route::*;
use crate::utils::{get_url, text_to_clipboard};
pub use model::{init, SigSidepanel};

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
                {
                    [
                        ("alkuun", Home, None),
                        ("látogatók", Visitors, Some("hu")),
                        ("Luxor sorsolás", Luxor, Some("hu")),
                        ("akunvalvonta", BatteryMonitor, None),
                        ("ostoslista", ShoppingList, None),
                        ("låttext", Lyrics, Some("sv")),
                        ("Arx Fatails minipeli", ArxFatalis, None),
                    ]
                        .into_iter()
                        .map(|(label, to, lang)| {
                            rsx! {
                                Link { class: "nav-link", to, lang, "{label}" }
                            }
                        })
                }
            }
            {
                let url = get_url();
                let code = QrCode::with_error_correction_level(url.as_bytes(), EcLevel::L)
                    .unwrap();
                let svg = code
                    .render()
                    .max_dimensions(200, 200)
                    .dark_color(svg::Color("var(--col-fg-0)"))
                    .light_color(svg::Color("var(--col-bg-0)"))
                    .build();
                rsx! {
                    div {
                        id: "qr-code",
                        class: "clickable",
                        dangerous_inner_html: svg,
                        onclick: move |_| {
                            text_to_clipboard(&url);
                        },
                    }
                }
            }
        }

        Outlet::<crate::routes::Route> {}
    }
}
