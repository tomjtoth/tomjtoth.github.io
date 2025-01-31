use std::time::Duration;

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;
use serde::{Deserialize, Serialize};

use crate::{
    components::battery_monitor::noti_txt,
    utils::{init_ctx, LocalStorageCompatible},
};

use super::{use_battery, BatteryState, UseBattery};

pub type SigBatMon = Signal<BatMon>;

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
            let delay = Duration::from_secs(1);
            use_future(move || async move {
                while let true = {
                    let bmr = batman.read();
                    bmr.loading
                } {
                    tracing::debug!("waiting for Battery Manager to load");
                    sleep(delay.clone()).await;
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
                        && ((s.level100 > upper && s.charging)
                            || (s.level100 < lower && !s.charging))
                    {
                        // TODO: works, but only after the next on_change closure call
                        // which updates the signal first
                        // there's about 10 seconds delay
                        tracing::debug!("{}", noti_txt(s.charging, s.level100));
                    }
                    tracing::debug!("waiting {:?}", delay);
                    sleep(delay).await;
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

    pub fn toggle(&mut self) {
        let restarting = {
            let r = self.conf.read();
            !r.allowed
        };

        {
            let mut w = self.conf.write();
            w.allowed = restarting;
            w.save();
        }

        if restarting {
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

pub enum BatMonConfPart {
    Min(u8),
    Max(u8),
    Run(bool),
}
