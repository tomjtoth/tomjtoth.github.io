mod config;
use crate::{
    utils::{use_persistent, UsePersistent},
    Route,
};
use config::LINKS;
use dioxus::prelude::*;
use qrcode::render::svg;
use qrcode::{EcLevel, QrCode, Version};

#[derive(Clone, Copy)]
pub struct SpState(pub UsePersistent<bool>);

#[component]
pub fn Sidepanel() -> Element {
    let mut state = SpState(use_persistent("sidepanel", || false));
    use_context_provider(|| state);

    let mut classes = vec!["border1-e"];

    if state.0.get() {
        classes.push("active");
    }

    rsx! {
        div {
            id: "sidepanel",
            class: classes.join(" "),
            onmouseleave: move |_| state.0.set(false),

            ul {
                li {
                    span {
                        class: "toggler nav-link clickable",
                        style: "float: right;",
                        onclick: move |_| state.0.set(false),
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
                    "https://ttj.hu".as_bytes(),
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

        Outlet::<Route> {}
    }
}
