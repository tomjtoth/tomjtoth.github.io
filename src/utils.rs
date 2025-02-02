use dioxus::{logger::tracing, prelude::*};
use gloo_net::http::{Request, Response};
use serde::{de::DeserializeOwned, Serialize};
use web_sys::{window, Notification, NotificationPermission, UrlSearchParams};

use crate::components::modal::{Button, CxModal};

pub trait LocalStorageCompatible: Serialize + DeserializeOwned + Default {
    const STORAGE_KEY: &'static str;

    fn save(&self) {
        let key = Self::STORAGE_KEY;
        let value = serde_json::to_string(self).expect("Serialization failed");
        if let Some(storage) = window().and_then(|w| w.local_storage().ok()).flatten() {
            storage
                .set_item(&key, &value)
                .expect("Failed to save data to localStorage");
        }
    }

    fn load_sig() -> Signal<Self> {
        use_signal(|| Self::load())
    }

    fn load() -> Self {
        let key = Self::STORAGE_KEY;
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

pub fn init_ctx<T: 'static>(closure: impl FnOnce() -> T) -> Signal<T> {
    let signal = use_signal(closure);
    use_context_provider(|| signal);
    signal
}

pub fn get_url() -> String {
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

pub fn text_to_clipboard(s: &str) {
    if let Some(win) = window() {
        let _promise = win.navigator().clipboard().write_text(s);
    }
}

pub fn get_search_params() -> Option<UrlSearchParams> {
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

pub async fn to_yaml<T: DeserializeOwned>(asset: Asset) -> T {
    let text = fetch(asset.to_string())
        .await
        .text()
        .await
        .expect("failed to turn response to text");

    serde_yaml::from_str::<T>(&text).expect(&format!("parsing the below failed:\n\n{text}"))
}

pub trait DisplayBytes {
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

pub async fn allowed_to_notify() -> bool {
    let mut modal = use_context::<CxModal>();
    let window = window().unwrap();
    if window.get("Notification").is_none() {
        modal
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
            modal
                .buttons(vec![(Button::Ok, None)])
                .prompt(rsx! { "ilmotiukset on estettyjä!" });
            return false;
        }
    }

    true
}

pub fn notify(message: &str) {
    let _ = Notification::new(message);
}
