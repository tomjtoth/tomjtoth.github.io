use dioxus::prelude::*;
use once_cell::sync::Lazy;
use std::collections::HashMap;

use super::{Cb, OptCb};

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
    lang: Language,
    r#type: Button,
    onclick: OptCb,
    reset: Cb,
}

#[component]
pub fn Btn(props: ModalButtonProps) -> Element {
    let translation = BUTTON_TRANSLATIONS.get(&props.lang).unwrap();
    let btn_type = props.r#type as usize;
    let text = translation[btn_type];

    rsx! {
        button {
            class: "clickable",
            autofocus: btn_type == 0 || btn_type == 2,
            onclick: move |evt| {
                if let Some(callback) = props.onclick {
                    callback.call(evt.clone())
                }
                props.reset.call(evt);
            },
            "{text}"
        }
    }
}
