use dioxus::{logger::tracing, prelude::*};

use crate::{
    components::{body::Body, header::Header, loader::*},
    hooks::*,
};

mod controls;

use controls::Controls;

static PLUGGED_IN_STR: &'static str = "ja laturi on vieläkin kiinni";
static UNPLUGGED_STR: &'static str = "eikä laturi oo kytkettynä";

pub(crate) fn noti_txt(charging: bool, lvl100: u8) -> String {
    format!(
        "Akun taso on nyt {lvl100}% {}",
        if charging {
            PLUGGED_IN_STR
        } else {
            UNPLUGGED_STR
        }
    )
}

#[component]
pub(crate) fn BatteryMonitor() -> Element {
    let BatMonConf {
        allowed,
        lower,
        upper,
    } = BATMON.conf();

    use_effect(|| {
        if !BATMON.loaded() {
            tracing::debug!("batmon loading -> LOADER.show()");
            LOADER.show()
        } else {
            if LOADER() {
                LOADER.hide();
            }
        }
    });

    rsx! {
        Header { title: "akunvalvonta", Controls {} }
        Body { class: "padded",
            p {
                "Tää työkalu "
                if allowed {
                    "hälyttää"
                } else {
                    "hälyttäisisi"
                }
                " kun akun taso on"
            }
            ul {
                li { "joko yli {upper}% {PLUGGED_IN_STR}" }
                li { "tai alle {lower}% {UNPLUGGED_STR}" }
            }
            if let Some(BatteryState { charging, level, .. }) = BATMON.state() {
                p {
                    if allowed {
                        "Kerran minuutissa katsotaan mikä akun "
                        "tilanne on ja hälytetään tarvittaessa."
                    } else {
                        "Jotta hälytykset tulisi, siun pitää sallia "
                        "työkalun pyörimistä taustalla."
                    }
                    " Sillä, et sivuston mikä näkymä on aktiivinen, "
                    "ei oo väliä, jos vaan pidät tämän välilehden auki."
                }
                p {
                    strong { "{noti_txt(charging, level)}" }
                }
            } else {
                p {
                    "Valitettavasti tämä selain "
                    strong { "ei tue tätä toimintaa" }
                    ". "
                    a {
                        href: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery#browser_compatibility",
                        target: "_blank",
                        "Tästä taulukosta"
                    }
                    " näkyy, mitkä selaimet tuetaan nykyään."
                }
            }
        }
    }
}
