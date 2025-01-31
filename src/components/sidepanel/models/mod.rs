use dioxus::prelude::*;

mod inner;

use crate::utils::LocalStorageCompatible;
use inner::Inner;

#[derive(Clone)]
pub struct CxSidepanel {
    inner: Signal<Inner>,
}

pub fn init() {
    CxSidepanel::init();
}

impl CxSidepanel {
    pub fn init() -> CxSidepanel {
        let inner = Inner::init();
        use_context_provider(|| CxSidepanel { inner })
    }

    pub fn is_active(&self) -> bool {
        self.inner.read().active
    }

    pub fn show(&mut self) {
        self.set_to(true);
    }

    pub fn hide(&mut self) {
        self.set_to(false);
    }

    fn set_to(&mut self, state: bool) {
        let mut w = self.inner.write();
        w.active = state;
        w.save();
    }
}
