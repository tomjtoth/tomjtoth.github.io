use std::collections::HashMap;

use dioxus::prelude::*;
use once_cell::sync::Lazy;

use super::{
    Cb,
    Language::{self, *},
    OptCb,
};

static TRANSLATIONS: Lazy<HashMap<Language, Vec<&'static str>>> = Lazy::new(|| {
    HashMap::from_iter(
        [
            (Hu, vec!["Oké", "Mégse", "Igen", "Nem"]),
            (Fi, vec!["Okei", "Peruuta", "Kyllä", "Ei"]),
            (En, vec!["Ok", "Cancel", "Yes", "No"]),
        ]
        .into_iter(),
    )
});

#[derive(Props, PartialEq, Clone)]
pub(crate) struct ButtonProps {
    lang: Language,
    r#type: super::Button,
    onclick: OptCb,
    reset: Cb,
}

#[component]
pub(crate) fn Button(props: ButtonProps) -> Element {
    let translation = TRANSLATIONS.get(&props.lang).unwrap();
    let as_usize = props.r#type as usize;
    let text = translation[as_usize];

    rsx! {
        button {
            class: "clickable",
            autofocus: as_usize == 0 || as_usize == 2,
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
