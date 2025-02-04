use dioxus::{logger::tracing, prelude::*};

use crate::{
    components::battery_monitor::noti_txt,
    utils::{allowed_to_notify, notify, LocalStorageCompatible},
};

mod battery_manager;
mod models;
mod service;

use models::*;
pub(crate) use models::{BatMonConf, BatteryState};

type GsBatMon = GlobalSignal<BatMon>;
pub(crate) static BATMON: GsBatMon = GlobalSignal::new(|| {
    battery_manager::init();

    BatMon {
        conf: BatMonConf::load(),
        state: None,
        loaded: false,
        service: service::use_service(),
    }
});

pub(crate) trait TrBatMon {
    fn loaded(&self) -> bool;
    fn allow(&self, allowed: bool);
    fn state(&self) -> Option<BatteryState>;
    fn conf(&self) -> BatMonConf;
    fn min(&self, val: u8);
    fn max(&self, val: u8);
}

impl TrBatMon for GsBatMon {
    fn loaded(&self) -> bool {
        self.with(|r| r.loaded)
    }

    fn allow(&self, allowed: bool) {
        tracing::debug!("set_allowed called with {allowed}");
        self.with_mut(|w| {
            w.conf.allowed = allowed;
            w.conf.save();
        });

        if allowed {
            self.with_mut(|r| r.service.restart());
        }
    }

    fn state(&self) -> Option<BatteryState> {
        self.read().state.clone()
    }

    fn conf(&self) -> BatMonConf {
        self.read().conf.clone()
    }

    fn min(&self, val: u8) {
        self.with_mut(|w| {
            w.conf.lower = val;
            w.conf.save()
        });
    }

    fn max(&self, val: u8) {
        self.with_mut(|w| {
            w.conf.upper = val;
            w.conf.save()
        });
    }
}
