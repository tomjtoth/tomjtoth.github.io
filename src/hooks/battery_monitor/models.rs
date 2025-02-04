use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

use crate::utils::{LSCompatStruct, LSCompatType};

#[derive(Clone, Debug)]
pub(crate) struct BatteryState {
    pub(crate) charging: bool,
    pub(crate) level: u8,
    pub(crate) battery_present: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub(crate) struct BatMonConf {
    pub(crate) lower: u8,
    pub(crate) upper: u8,
    pub(crate) allowed: bool,
}

impl Default for BatMonConf {
    fn default() -> Self {
        BatMonConf {
            lower: 20,
            upper: 80,
            allowed: false,
        }
    }
}

impl LSCompatType for BatMonConf {}
impl LSCompatStruct for BatMonConf {
    const STORAGE_KEY: &'static str = "battery-monitor";
}

pub(crate) struct BatMon {
    pub(super) conf: BatMonConf,
    pub(super) state: Option<BatteryState>,
    pub(super) service: UseFuture,
    pub(super) loaded: bool,
}
