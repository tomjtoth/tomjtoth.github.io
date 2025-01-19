use crate::components::*;
use dioxus::prelude::*;

#[derive(Debug, Clone, Routable, PartialEq)]
#[rustfmt::skip]
pub enum Route {
    #[layout(Modal)]
    #[layout(Sidepanel)]
    #[route("/")]
    Home {},
    
    #[route("/visitors")]
    Visitors {},
    
    #[route("/luxor")]
    Luxor {},
    
    #[route("/battery-monitor")]
    BatteryMonitor {},
    
    #[route("/shopping-list")]
    ShoppingList {},
    
    #[route("/lyrics")]
    Lyrics {},

    #[route("/arx-fatalis")]
    ArxFatalis {},
}
