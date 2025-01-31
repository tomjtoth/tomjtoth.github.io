use controls::Controls;
use dioxus::{logger::tracing, prelude::*};

mod controls;

use crate::{
    components::{body::Body, header::Header, loader::Loader},
    hooks::{BatMonConf, BatteryState, SigBatMon},
};

static PLUGGED_IN_STR: &'static str = "ja laturi on vieläkin kiinni";
static UNPLUGGED_STR: &'static str = "eikä laturi oo kytkettynä";

pub fn noti_txt(charging: bool, lvl100: u8) -> String {
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
pub fn BatteryMonitor() -> Element {
    let batmon = use_context::<SigBatMon>();
    let BatMonConf {
        allowed,
        min_val,
        max_val,
    } = {
        let r = batmon.read();
        r.read_conf()
    };

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
                li { "joko yli {max_val}% {PLUGGED_IN_STR}" }
                li { "tai alle {min_val}% {UNPLUGGED_STR}" }
            }
            if batmon.read().loading() {
                Loader {}
            } else {
                if let Some(BatteryState { charging, level, .. }) = batmon.read().get_state() {
                    p {
                        if allowed {
                            "Kerran minuutissa (ala- ja ylärajojen säätö nollaa "
                            "ajastimen) katsotaan mikä akun tilanne on ja hälytetään "
                            "tarvittaessa."
                        } else {
                            "Jotta hälytykset tulisi, siun pitää sallia "
                            "työkalun pyörimistä taustalla."
                        }
                        " Sillä, et sivuston mikä näkymä on aktiivinen, "
                        "ei oo väliä, jos vaan pidät tämän välilehden auki."
                    }
                    {
                        let lvl100 = (level * 100.0) as u8;
                        rsx! {
                            p {
                                strong { "{noti_txt(charging, lvl100)}" }
                            }
                        }
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
}
