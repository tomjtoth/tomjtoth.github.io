use dioxus::prelude::*;
use qrcode::{render::svg, EcLevel, QrCode};

use crate::routes::Route::*;
use crate::utils::{get_url, text_to_clipboard};

mod models;

pub(crate) use models::*;

#[component]
pub(crate) fn Sidepanel() -> Element {
    let class = format!("border1-e{}", if SIDEPANEL() { " active" } else { "" });

    rsx! {
        div {
            id: "sidepanel",
            class,
            onmouseleave: move |_| SIDEPANEL.hide(),

            ul {
                li {
                    span {
                        class: "toggler nav-link clickable",
                        style: "float: right;",
                        onclick: move |_| SIDEPANEL.hide(),
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
                                Link {
                                    class: "nav-link",
                                    to,
                                    lang,
                                    onclick: |_| SIDEPANEL.hide_async(),
                                    "{label}"
                                }
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
