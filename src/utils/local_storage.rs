use dioxus::logger::tracing;
use serde::{de::DeserializeOwned, Serialize};
use web_sys::window;

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
