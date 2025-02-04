use std::time::Duration;

use dioxus::prelude::*;
use gloo_timers::future::sleep;
use wasm_bindgen_futures::spawn_local;

use crate::utils::LSCompatType;

static KEY: &'static str = "sidepanel";
type GsSidepanel = GlobalSignal<bool>;
pub(crate) static SIDEPANEL: GsSidepanel = GlobalSignal::new(|| bool::load_t(KEY));

pub(crate) trait TrSidepanel {
    const DELAY: Duration = Duration::from_millis(10);

    fn show(&self);
    fn hide(&self);
    fn hide_async(&self);
    fn set_to(&self, state: bool);
}

impl TrSidepanel for GsSidepanel {
    fn show(&self) {
        self.set_to(true);
    }

    fn hide(&self) {
        self.set_to(false);
    }

    /// successfully animates closing of SP while changing view
    fn hide_async(&self) {
        spawn_local(async {
            sleep(Self::DELAY).await;
            SIDEPANEL.hide();
        });
    }

    fn set_to(&self, state: bool) {
        self.with_mut(|w| {
            *w = state;
            w.save_t(KEY);
        })
    }
}
