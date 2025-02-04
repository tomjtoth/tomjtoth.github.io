use std::time::Duration;

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;

type GsLoader = GlobalSignal<bool>;
pub static LOADER: GsLoader = GlobalSignal::with_name(|| false, "loader");

pub trait TrLoader {
    fn show(&self);
    async fn hide(&self);
}

impl TrLoader for GsLoader {
    fn show(&self) {
        tracing::debug!("showing Loader");
        *self.write() = true;
    }

    /// hiding with a delay to avoid an awkward intermediate phase
    async fn hide(&self) {
        let dur = Duration::from_millis(500);
        tracing::debug!("hiding Loader after {:?}", dur);
        sleep(dur).await;
        *self.write() = false;
    }
}
