use dioxus::prelude::*;

pub(crate) static LOCKED: GlobalSignal<bool> = GlobalSignal::with_name(|| true, "luxor-lock");
