use dioxus::prelude::*;
use once_cell::sync::Lazy;
use std::collections::HashMap;

use super::OptCb;

#[derive(Debug, Hash, Eq, PartialEq, Clone, Copy)]
pub enum Language {
    Hu,
    Fi,
    En,
}

#[derive(Debug, Hash, Eq, PartialEq, Clone)]
pub enum Button {
    Ok,
    Cancel,
    Yes,
    No,
}

// Static HashMap containing button translations
static BUTTON_TRANSLATIONS: Lazy<HashMap<Language, Vec<&'static str>>> = Lazy::new(|| {
    let mut translations = HashMap::new();

    translations.insert(Language::Hu, vec!["Oké", "Mégse", "Igen", "Nem"]);
    translations.insert(Language::Fi, vec!["Okei", "Peruuta", "Kyllä", "Ei"]);
    translations.insert(Language::En, vec!["Ok", "Cancel", "Yes", "No"]);

    translations
});

#[derive(Props, PartialEq, Clone)]
pub struct ModalButtonProps {
    cfg: (Language, Button, OptCb),
}

#[component]
pub fn Btn(props: ModalButtonProps) -> Element {
    let idx = props.cfg.1 as usize;
    let trans = BUTTON_TRANSLATIONS.get(&props.cfg.0).unwrap();
    let text = trans[idx];

    if let Some(cb) = props.cfg.2 {
        rsx! { button { onclick: cb, "{text}" } }
    } else {
        rsx! { button { "{text}" } }
    }
}
