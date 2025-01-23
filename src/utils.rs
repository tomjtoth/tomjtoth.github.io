use dioxus::{logger::tracing, prelude::*};
use reqwest::Response;
use serde::{de::DeserializeOwned, Serialize};
use web_sys::{window, UrlSearchParams};

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

    fn load() -> Self {
        let key = Self::STORAGE_KEY;
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

pub fn get_pathname() -> String {
    let loc = window().unwrap().location();
    loc.pathname().unwrap_or("https://ttj.hu".to_string())
}

pub fn url_sp() -> Option<UrlSearchParams> {
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
    reqwest::get(&url).await.expect("failed to fetch {url}")
}

pub async fn to_yaml<T>(asset: Asset) -> T
where
    T: DeserializeOwned,
{
    let text = fetch(asset.to_string())
        .await
        .text()
        .await
        .expect("failed to turn response to text");

    tracing::debug!(text);

    serde_yaml::from_str::<T>(&text).expect("YAML parsing error")
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
