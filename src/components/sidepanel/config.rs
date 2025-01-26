pub struct Link2View {
    pub label: &'static str,
    pub to: &'static str,
    pub lang: Option<&'static str>,
}

// TODO: change these to the enums as in the example
pub static LINKS: &[Link2View] = &[
    Link2View {
        label: "alkuun",
        to: "/",
        lang: None,
    },
    Link2View {
        label: "látogatók",
        to: "/visitors",
        lang: Some("hu"),
    },
    Link2View {
        label: "Luxor sorsolás",
        to: "/luxor",
        lang: Some("hu"),
    },
    Link2View {
        label: "akunvalvonta",
        to: "/battery-monitor",
        lang: None,
    },
    Link2View {
        label: "ostoslista",
        to: "/shopping-list",
        lang: None,
    },
    Link2View {
        label: "låttext",
        to: "/lyrics",
        lang: Some("sv"),
    },
    Link2View {
        label: "Arx Fatails minipeli",
        to: "/arx-fatalis",
        lang: None,
    },
];
