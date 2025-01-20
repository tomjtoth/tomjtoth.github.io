use dioxus::prelude::*;
use once_cell::sync::Lazy;
use std::collections::HashMap;

pub type Cb = Callback<MouseEvent>;
pub type OptCb = Option<Cb>;

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
    let translation = BUTTON_TRANSLATIONS.get(&props.cfg.0).unwrap();
    let btn_type = props.cfg.1 as usize;
    let text = translation[btn_type];

    if let Some(callback) = props.cfg.2 {
        rsx! {
            button { class: "clickable",
                onclick: move |evt| {callback.call(evt)}, "{text}"
            }
        }
    } else {
        rsx! { button { class: "clickable", "{text}" } }
    }
}
