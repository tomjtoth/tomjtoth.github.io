use std::time::Duration;

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;
use serde::{Deserialize, Serialize};

use crate::{
    components::battery_monitor::noti_txt,
    utils::{allowed_to_notify, init_ctx, notify, LocalStorageCompatible},
};

use super::{use_battery, BatteryState, UseBattery};

pub type SigBatMon = Signal<BatMon>;

// TODO: refactor ALL Sig* types accross the app
// remove them, take UsePersistent as an example
// wrap the signal in the struct, not the other way around!!
// hence syntax getc cleaner `some_sig.read().some_method()`
// becomes `some_struct.some_method()`, more readable!

pub struct BatMon {
    conf: Signal<BatMonConf>,
    batman: UseBattery,
    service: UseFuture,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct BatMonConf {
    pub min_val: u8,
    pub max_val: u8,
    pub allowed: bool,
}

impl Default for BatMonConf {
    fn default() -> Self {
        BatMonConf {
            min_val: 20,
            max_val: 80,
            allowed: false,
        }
    }
}

impl LocalStorageCompatible for BatMonConf {
    const STORAGE_KEY: &'static str = "battery-monitor";
}

impl BatMon {
    pub fn init() {
        let conf = use_signal(|| BatMonConf::load());
        let batman = use_battery();

        let service = {
            let conf = conf.clone();
            let second = Duration::from_secs(1);
            let minute = Duration::from_secs(60);
            use_future(move || async move {
                // TODO: find a less resource hungry way to wait for BatMan to load
                while let true = {
                    let r = batman.read();
                    r.loading
                } {
                    tracing::debug!("waiting for Battery Manager to load");
                    sleep(second).await;
                }

                while let (
                    BatMonConf {
                        allowed: true,
                        min_val: lower,
                        max_val: upper,
                    },
                    Some(s),
                ) = {
                    let c = conf.read();
                    let bm = batman.read();
                    (c.clone(), bm.state.clone())
                } {
                    if s.battery_present
                        && ((s.level >= upper && s.charging) || (s.level <= lower && !s.charging))
                    {
                        // TODO: works, but only after the next on_change closure call
                        // which updates the signal first
                        // there's about 10 seconds delay
                        if allowed_to_notify().await {
                            let message = noti_txt(s.charging, s.level);
                            notify(&message);
                            tracing::debug!(r#"notifying user: "{message}""#);
                        }
                    }
                    tracing::debug!("waiting {:?}", minute);
                    sleep(minute).await;
                }
            })
        };

        init_ctx(|| BatMon {
            conf,
            batman,
            service,
        });
    }

    pub fn loading(&self) -> bool {
        let bmr = self.batman.read();
        bmr.loading
    }

    pub fn set_allowed(&mut self, allowed: bool) {
        tracing::debug!("set_allowed called with {allowed}");
        {
            let mut w = self.conf.write();
            w.allowed = allowed;
            w.save();
        }

        if allowed {
            self.service.restart();
        }
    }

    pub fn get_state(&self) -> Option<BatteryState> {
        self.batman.read().state.clone()
    }

    pub fn read_conf(&self) -> BatMonConf {
        self.conf.read().clone()
    }

    pub fn set_min(&mut self, val: u8) {
        let mut w = self.conf.write();
        w.min_val = val;
        w.save()
    }

    pub fn set_max(&mut self, val: u8) {
        let mut w = self.conf.write();
        w.max_val = val;
        w.save()
    }
}
