use dioxus::prelude::*;

use crate::utils::LSCompatType;

static KEY: &'static str = "sidepanel";
type GsSidepanel = GlobalSignal<bool>;

pub(crate) static SIDEPANEL: GsSidepanel = GlobalSignal::new(|| bool::load_t(KEY));

pub(crate) trait TrSidepanel {
    fn show(&self);
    fn hide(&self);
    fn set_to(&self, state: bool);
}

impl TrSidepanel for GsSidepanel {
    fn show(&self) {
        self.set_to(true);
    }

    fn hide(&self) {
        self.set_to(false);
    }

    fn set_to(&self, state: bool) {
        self.with_mut(|w| {
            *w = state;
            w.save_t(KEY);
        })
    }
}
