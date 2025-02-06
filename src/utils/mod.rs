use dioxus::logger::tracing;
use gloo_net::http::{Request, Response};
use serde::de::DeserializeOwned;
use web_sys::{window, UrlSearchParams};

mod from_cache;
mod local_storage;
mod notification;

pub(crate) use from_cache::*;
pub(crate) use local_storage::*;
pub(crate) use notification::*;

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

async fn fetch(url: &String) -> Response {
    let base_url = web_sys::window().unwrap().origin();
    let url = format!("{}{}", base_url, url);
    Request::get(&url)
        .send()
        .await
        .expect("failed to fetch {url}")
}

pub(crate) async fn to_yaml<T: DeserializeOwned>(url: &String) -> T {
    let text = fetch(url)
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
