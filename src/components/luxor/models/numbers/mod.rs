use dioxus::prelude::*;
use inner::Inner;

use crate::utils::LocalStorageCompatible;

mod inner;

#[derive(Clone)]
pub struct CxNumbers {
    inner: Signal<Inner>,
}

impl CxNumbers {
    pub fn init() {
        let inner = Inner::init();
        use_context_provider(|| Self { inner });
    }

    pub fn len(&self) -> usize {
        self.inner.read().numbers.len()
    }

    pub fn get_rg(&self, lower: usize, upper: usize) -> Vec<u8> {
        self.inner.read().numbers[lower..upper].to_vec()
    }

    pub fn rm_last(&mut self) {
        let mut w = self.inner.write();

        w.numbers.pop();
        w.save();
    }

    pub fn add(&mut self, num: u8) {
        if !self.has(num) {
            let mut w = self.inner.write();

            w.numbers.push(num);
            w.save();
        }
    }

    pub fn has(&self, num: u8) -> bool {
        self.inner.read().numbers.iter().any(|n| *n == num)
    }

    pub fn clear(&mut self) {
        let mut w = self.inner.write();

        w.numbers.clear();
        w.save();
    }
}
