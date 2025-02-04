use dioxus::prelude::*;

use crate::utils::{LSCompatStruct, LSCompatType};

type Numbers = Vec<u8>;

impl LSCompatType for Numbers {}
impl LSCompatStruct for Numbers {
    const STORAGE_KEY: &'static str = "luxor-numbers";
}

pub(crate) type GsNumbers = GlobalSignal<Numbers>;

pub(crate) static NUMBERS: GsNumbers = Signal::global(|| Numbers::load());

pub(crate) trait TrNumbers {
    fn get_rg(&self, lower: usize, upper: usize) -> Vec<u8>;
    fn rm_last(&self);
    fn add(&self, num: u8);
    fn has(&self, num: u8) -> bool;
    fn clear(&self);
}

impl TrNumbers for GsNumbers {
    fn get_rg(&self, lower: usize, upper: usize) -> Vec<u8> {
        let r = self.read();
        let v = r[lower..upper].to_vec();
        v
    }

    fn rm_last(&self) {
        self.with_mut(|w| {
            w.pop();
            w.save();
        });
    }

    fn add(&self, num: u8) {
        if !self.has(num) {
            self.with_mut(|w| {
                w.push(num);
                w.save();
            });
        }
    }

    fn has(&self, num: u8) -> bool {
        self.iter().any(|n| *n == num)
    }

    fn clear(&self) {
        self.with_mut(|w| {
            w.clear();
            w.save();
        });
    }
}
