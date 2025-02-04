use dioxus::prelude::*;

use crate::{hooks::*, utils::allowed_to_notify};

#[component]
pub(crate) fn Controls() -> Element {
    let BatMonConf {
        lower,
        upper,
        allowed,
    } = BATMON.conf();
    let state = BATMON.state();
    let mut sig_chkbox = use_signal(|| allowed);
    let disabled = !state.is_some();
    let class = if disabled {
        "clicking-not-allowed"
    } else {
        "clickable"
    };

    rsx! {
        label { r#for: "bat-mon-allowed", class, "sallittu:" }
        input {
            id: "bat-mon-allowed",
            r#type: "checkbox",
            checked: sig_chkbox(),
            class,
            disabled,
            onchange: move |evt| async move {
                sig_chkbox.toggle();
                if evt.checked() && allowed_to_notify().await {
                    BATMON.allow(true);
                } else {
                    BATMON.allow(false);
                    sig_chkbox.set(false);
                }
            },
        }
        input {
            id: "bat-mon-lower",
            r#type: "number",
            value: lower,
            max: 50,
            min: 10,
            class,
            disabled,
            title: "alaraja",
            onchange: move |evt| {
                if let Ok(as_u8) = evt.value().parse::<u8>() {
                    BATMON.min(as_u8);
                }
            },
        }


        strong { id: "bat-mon-hud", class: "bordered",
            if let Some(s) = state {
                if s.charging {
                    "⚡"
                } else {
                    if (upper).abs_diff(s.level) < (lower).abs_diff(s.level) {
                        "🔋"
                    } else {
                        "🪫"
                    }
                }
                " {s.level}%"
            }
        }
        input {
            id: "bat-mon-upper",
            r#type: "number",
            value: upper,
            max: 90,
            min: 50,
            class,
            disabled,
            title: "yläraja",
            onchange: move |evt| {
                if let Ok(as_u8) = evt.value().parse::<u8>() {
                    BATMON.max(as_u8);
                }
            },
        }
    }
}
