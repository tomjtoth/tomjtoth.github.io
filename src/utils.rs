use dioxus::{logger::tracing, prelude::*};
use gloo_net::http::{Request, Response};
use serde::{de::DeserializeOwned, Serialize};
use web_sys::{window, Notification, NotificationOptions, NotificationPermission, UrlSearchParams};

use crate::components::modal::*;

/// LocalStorage compatibility for more generic types
pub(crate) trait LSCompatType: Serialize + DeserializeOwned + Default {
    fn save_t(&self, key: &'static str) {
        let value = serde_json::to_string(self).expect("Serialization failed");
        if let Some(storage) = window().and_then(|w| w.local_storage().ok()).flatten() {
            storage
                .set_item(&key, &value)
                .expect("Failed to save data to localStorage");
        }
    }

    fn load_t(key: &'static str) -> Self {
        tracing::debug!("{key} read from localStorage");

        if let Some(storage) = window().and_then(|w| w.local_storage().ok()).flatten() {
            if let Ok(Some(value)) = storage.get_item(&key) {
                serde_json::from_str(&value).unwrap_or(Self::default())
            } else {
                Self::default()
            }
        } else {
            Self::default()
        }
    }
}

impl LSCompatType for bool {}
impl LSCompatType for Vec<String> {}

/// LocalStorage compatibility for structs
pub(crate) trait LSCompatStruct: LSCompatType {
    const STORAGE_KEY: &'static str;

    fn save(&self) {
        self.save_t(Self::STORAGE_KEY);
    }

    fn load() -> Self {
        Self::load_t(Self::STORAGE_KEY)
    }
}

pub(crate) fn get_url() -> String {
    let fallback = "https://ttj.hu".to_string();

    if let Some(win) = window() {
        if let Ok(str) = win.location().href() {
            str
        } else {
            tracing::error!("location.href inaccessible");
            fallback
        }
    } else {
        tracing::error!("window inaccessible");
        fallback
    }
}

pub(crate) fn text_to_clipboard(s: &str) {
    if let Some(win) = window() {
        let _promise = win.navigator().clipboard().write_text(s);
    }
}

pub(crate) fn get_search_params() -> Option<UrlSearchParams> {
    let loc = window().unwrap().location();

    if let Ok(xx) = loc.search() {
        if let Ok(asd) = UrlSearchParams::new_with_str(&xx) {
            Some(asd)
        } else {
            None
        }
    } else {
        None
    }
}

async fn fetch(url: String) -> Response {
    let base_url = web_sys::window().unwrap().origin();
    let url = format!("{}{}", base_url, url);
    Request::get(&url)
        .send()
        .await
        .expect("failed to fetch {url}")
}

pub(crate) async fn to_yaml<T: DeserializeOwned>(asset: Asset) -> T {
    let text = fetch(asset.to_string())
        .await
        .text()
        .await
        .expect("failed to turn response to text");

    serde_yaml::from_str::<T>(&text).expect(&format!("parsing the below failed:\n\n{text}"))
}

pub(crate) trait DisplayBytes {
    fn displ_as_dec(&self) -> String;
}

impl DisplayBytes for Vec<u8> {
    fn displ_as_dec(&self) -> String {
        self.iter()
            .map(|byte| byte.to_string())
            .collect::<Vec<_>>()
            .join(", ")
    }
}

pub(crate) async fn allowed_to_notify() -> bool {
    let window = window().unwrap();
    if window.get("Notification").is_none() {
        MODAL
            .buttons(vec![(Button::Ok, None)])
            .prompt(rsx! { "ilmoituksia ei tueta!" });
        return false;
    }

    if Notification::permission() != NotificationPermission::Granted {
        let permission_promise = Notification::request_permission().unwrap();
        let permission = wasm_bindgen_futures::JsFuture::from(permission_promise)
            .await
            .unwrap()
            .as_string()
            .unwrap();

        if permission == "granted" {
            notify("näyteilmoitus");
        } else {
            MODAL
                .buttons(vec![(Button::Ok, None)])
                .prompt(rsx! { "ilmotiukset on estettyjä!" });
            return false;
        }
    }

    true
}

pub(crate) fn notify(message: &str) {
    let opts = NotificationOptions::new();
    opts.set_icon("/assets/icon.png");
    opts.set_lang("fi");
    let _ = Notification::new_with_options(message, &opts);
}
