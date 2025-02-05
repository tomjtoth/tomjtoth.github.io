use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{window, Request, Response, Url};

pub(crate) async fn from_cache(resource: &str) -> Result<Option<String>, JsValue> {
    let window = window().ok_or("No global `window` exists")?;
    let caches = window.caches()?;

    let request = Request::new_with_str(resource)?;

    let response_promise = caches.match_with_request(&request);
    let response = JsFuture::from(response_promise).await?;

    if response.is_undefined() {
        return Ok(None);
    }

    let response: Response = response.dyn_into()?;
    let blob_promise = response.blob()?;
    let blob = JsFuture::from(blob_promise).await?;

    let object_url = Url::create_object_url_with_blob(&blob.dyn_into()?)?;

    Ok(Some(object_url))
}
