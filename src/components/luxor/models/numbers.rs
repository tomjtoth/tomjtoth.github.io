use dioxus::signals::Signal;
use serde::{Deserialize, Serialize};

use crate::utils::{init_ctx, LocalStorageCompatible};

#[derive(Serialize, Deserialize, Clone)]
pub struct Numbers(Vec<u8>);
impl Default for Numbers {
    fn default() -> Self {
        Numbers(vec![])
    }
}

pub type SigNumbers = Signal<Numbers>;

impl LocalStorageCompatible for Numbers {
    const STORAGE_KEY: &'static str = "luxor-numbers";
}

impl Numbers {
    pub fn init() {
        init_ctx(|| Self::load());
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn get_rg(&self, lower: usize, upper: usize) -> Vec<u8> {
        self.0[lower..upper].to_vec()
    }

    pub fn rm_last(&mut self) {
        self.0.pop();
        self.save();
    }

    pub fn add(&mut self, num: u8) {
        if !self.has(num) {
            self.0.push(num);
            self.save();
        }
    }

    pub fn has(&self, num: u8) -> bool {
        self.0.iter().any(|n| *n == num)
    }

    pub fn clear(&mut self) {
        self.0.clear();
        self.save();
    }
}
