use dioxus::logger::tracing;
use dioxus::prelude::*;

use crate::utils::LSCompatType;

type Inner = Vec<String>;
static KEY: &'static str = "lyrics-active";

type GsActive = GlobalSignal<Inner>;
pub(crate) static ACTIVE: GsActive = GlobalSignal::new(|| Inner::load_t(KEY));

pub(crate) trait TrActive {
    fn is(&self, id: &String) -> bool;
    fn toggle(&self, str: &String);
}

impl TrActive for GsActive {
    fn is(&self, id: &String) -> bool {
        self.with(|r| r.contains(id))
    }

    fn toggle(&self, str: &String) {
        tracing::debug!("toggling {str}");

        self.with_mut(|w| {
            if w.contains(&str) {
                w.retain(|id| id != str);
            } else {
                w.push(str.to_string());
            }
            w.save_t(KEY);
            tracing::debug!("{:?}", w);
        });
    }
}
