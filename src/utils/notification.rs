use dioxus::prelude::*;
use web_sys::{window, Notification, NotificationOptions, NotificationPermission};

use crate::components::modal::*;

pub(crate) async fn allowed_to_notify() -> bool {
    let window = window().unwrap();
    if window.get("Notification").is_none() {
        MODAL
            .ok(None)
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
                .ok(None)
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
