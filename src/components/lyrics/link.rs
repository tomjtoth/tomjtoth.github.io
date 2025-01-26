use dioxus::prelude::*;

#[derive(Props, Clone, PartialEq)]
pub struct LinkProps {
    url: Option<String>,
}

#[component]
pub fn Link(props: LinkProps) -> Element {
    rsx! {
        if let Some(url) = props.url {
            a {
                href: url.to_string(),
                target: "_blank",

                if url.starts_with("https://translate.google.com") {
                    svg {
                        class: "google-translate",
                        width: 16,
                        view_box: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",

                        path {
                            d: "M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
                        }
                    }
                } else {
                    svg {

                        height: "16",
                        view_box: "0 0 28.57 20",
                        xmlns: "http://www.w3.org/2000/svg",

                        g {
                            path {
                                d: "M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z",
                                fill: "#FF0000"
                            }
                            path {
                                d: "M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z",
                                fill: "white"
                            }
                        }
                    }
                }
            }
        }
    }
}
