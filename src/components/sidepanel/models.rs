use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

use crate::utils::LocalStorageCompatible;

#[derive(Serialize, Deserialize)]
pub struct Sidepanel {
    active: bool,
}

impl Default for Sidepanel {
    fn default() -> Self {
        Self { active: false }
    }
}

impl LocalStorageCompatible for Sidepanel {
    const STORAGE_KEY: &'static str = "sidepanel";
}

type GsSidepanel = GlobalSignal<Sidepanel>;

pub static SIDEPANEL: GsSidepanel = GlobalSignal::new(|| Sidepanel::load());

pub trait TrSidepanel {
    fn is_active(&self) -> bool;
    fn show(&self);
    fn hide(&self);
    fn set_to(&self, state: bool);
}

impl TrSidepanel for GsSidepanel {
    fn is_active(&self) -> bool {
        self.read().active
    }

    fn show(&self) {
        self.set_to(true);
    }

    fn hide(&self) {
        self.set_to(false);
    }

    fn set_to(&self, state: bool) {
        self.with_mut(|w| {
            w.active = state;
            w.save();
        });
    }
}
