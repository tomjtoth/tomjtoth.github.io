use dioxus::prelude::*;

use crate::components::arx_fatalis::models::SigCastSpells;

#[component]
pub fn Controls() -> Element {
    let spells = use_context::<SigCastSpells>();
    let score = spells.read().score();

    rsx! {
        "💎 {score}"
        a {
            class: "spells",
            href: "https://wiki.arx-libertatis.org/Spells",
            target: "_blank",
            "📖"
                //     {noti && (
        //       <>
        //         &nbsp;<sub>{noti.page}</sub>
        //       </>
        //     )}
        }
    }
    //   {noti && (
    //     <>
    //       {noti.spell} ({noti.sequence.join(" + ")})
    //     </>
    //   )}
    //   {/* TODO: <span id="reset-runes-score">reset</span> */}
}
