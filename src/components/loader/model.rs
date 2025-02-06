use std::time::Duration;

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;
use wasm_bindgen_futures::spawn_local;

type GsLoader = GlobalSignal<bool>;
pub static LOADER: GsLoader = GlobalSignal::with_name(|| false, "loader");

pub trait TrLoader {
    fn show(&self);
    fn hide(&self);
}

impl TrLoader for GsLoader {
    fn show(&self) {
        tracing::debug!("showing Loader");
        *self.write() = true;
    }

    /// hiding with a delay to avoid an awkward intermediate phase
    fn hide(&self) {
        spawn_local(async {
            let dur = Duration::from_millis(500);
            tracing::debug!("hiding Loader after {:?}", dur);
            sleep(dur).await;
            *LOADER.write() = false;
        });
    }
}
