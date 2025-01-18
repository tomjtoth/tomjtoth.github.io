use dioxus::prelude::*;
use gloo_storage::{LocalStorage, Storage};
use serde::{de::DeserializeOwned, Serialize};
use web_sys::window;

/// A persistent storage hook that can be used to store data across application reloads.
#[allow(clippy::needless_return)]
pub fn use_persistent<T: Serialize + DeserializeOwned + Default + 'static>(
    // A unique key for the storage entry
    key: impl ToString,
    // A function that returns the initial value if the storage entry is empty
    init: impl FnOnce() -> T,
) -> UsePersistent<T> {
    // Use the use_signal hook to create a mutable state for the storage entry
    let state = use_signal(move || {
        // This closure will run when the hook is created
        let key = key.to_string();
        let value = LocalStorage::get(key.as_str()).ok().unwrap_or_else(init);
        StorageEntry { key, value }
    });

    // Wrap the state in a new struct with a custom API
    UsePersistent { inner: state }
}

struct StorageEntry<T> {
    key: String,
    value: T,
}

/// Storage that persists across application reloads
pub struct UsePersistent<T: 'static> {
    inner: Signal<StorageEntry<T>>,
}

impl<T> Clone for UsePersistent<T> {
    fn clone(&self) -> Self {
        *self
    }
}

impl<T> Copy for UsePersistent<T> {}

impl<T: Serialize + DeserializeOwned + Clone + 'static> UsePersistent<T> {
    /// Returns a reference to the value
    pub fn get(&self) -> T {
        self.inner.read().value.clone()
    }

    /// Sets the value
    pub fn set(&mut self, value: T) {
        let mut inner = self.inner.write();
        // Write the new value to local storage
        LocalStorage::set(inner.key.as_str(), &value).unwrap();
        inner.value = value;
    }
}

pub fn get_pathname() -> String {
    let loc = window().unwrap().location();
    loc.pathname().unwrap_or("https://ttj.hu".to_string())
}

pub async fn fetch_yaml<T>(yaml: &str, fallback: T) -> T
where
    T: DeserializeOwned,
{
    let base_url = web_sys::window().unwrap().origin();

    // Construct the full URL
    let url = format!("{}{}", base_url, yaml);

    // Attempt to fetch and deserialize the YAML
    match reqwest::get(&url).await {
        Ok(response) => match response.text().await {
            Ok(text) => serde_yaml::from_str::<T>(&text).unwrap_or(fallback),
            Err(_) => fallback,
        },
        Err(_) => fallback,
    }
}
