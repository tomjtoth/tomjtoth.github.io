use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;
use serde::{Deserialize, Serialize};
use std::time::Duration;

use crate::{
    components::battery_monitor::noti_txt,
    utils::{allowed_to_notify, notify, LocalStorageCompatible},
};

use super::{use_battery, BatteryState, UseBattery};

#[derive(Serialize, Deserialize, Clone)]
pub(crate) struct BatMonConf {
    pub(crate) min_val: u8,
    pub(crate) max_val: u8,
    pub(crate) allowed: bool,
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

pub(crate) struct BatMon {
    conf: Signal<BatMonConf>,
    batman: UseBattery,
    service: UseFuture,
}

type GsBatMon = GlobalSignal<BatMon>;
pub(crate) static BATMON: GsBatMon = GlobalSignal::new(|| {
    let conf = use_signal(|| BatMonConf::load());
    let batman = use_battery();

    let service = {
        let conf = conf.clone();
        let second = Duration::from_secs(1);
        let minute = Duration::from_secs(60);

        use_future(move || async move {
            // TODO: find a less resource hungry way to wait for BatMan to load
            while let true = batman.with(|r| r.loading) {
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

    BatMon {
        conf,
        batman,
        service,
    }
});

pub(crate) trait TrBatMon {
    fn loading(&self) -> bool;
    fn set_allowed(&self, allowed: bool);
    fn get_state(&self) -> Option<BatteryState>;
    fn read_conf(&self) -> BatMonConf;
    fn set_min(&self, val: u8);
    fn set_max(&self, val: u8);
}

impl TrBatMon for GsBatMon {
    fn loading(&self) -> bool {
        self.with(|r| r.batman.with(|bmr| bmr.loading))
    }

    fn set_allowed(&self, allowed: bool) {
        tracing::debug!("set_allowed called with {allowed}");
        self.with_mut(|r| {
            r.conf.with_mut(|wc| {
                wc.allowed = allowed;
                wc.save();
            })
        });

        if allowed {
            self.with_mut(|r| r.service.restart());
        }
    }

    fn get_state(&self) -> Option<BatteryState> {
        self.read().batman.read().state.clone()
    }

    fn read_conf(&self) -> BatMonConf {
        self.read().conf.read().clone()
    }

    fn set_min(&self, val: u8) {
        self.write().conf.with_mut(|w| {
            w.min_val = val;
            w.save()
        });
    }

    fn set_max(&self, val: u8) {
        self.write().conf.with_mut(|w| {
            w.max_val = val;
            w.save()
        });
    }
}
