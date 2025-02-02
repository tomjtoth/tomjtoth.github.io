use dioxus::prelude::*;

use crate::components::{
    arx_fatalis::ArxFatalis, battery_monitor::BatteryMonitor, home::Home, luxor::Luxor,
    lyrics::Lyrics, modal::ModalComponent, not_found::NotFound, shopping_list::ShoppingList,
    sidepanel::Sidepanel, visitors::Visitors,
};

#[derive(Debug, Clone, Routable, PartialEq)]
pub enum Route {
    #[layout(ModalComponent)]
    #[layout(Sidepanel)]
    #[route("/")]
    Home,

    #[route("/visitors")]
    Visitors,

    #[route("/luxor")]
    Luxor,

    #[route("/battery-monitor")]
    BatteryMonitor,

    #[route("/shopping-list")]
    ShoppingList,

    #[route("/lyrics")]
    Lyrics,

    #[route("/arx-fatalis")]
    ArxFatalis,

    #[route("/:..path")]
    NotFound { path: Vec<String> },
}
