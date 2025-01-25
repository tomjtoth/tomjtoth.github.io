use dioxus::signals::Signal;

mod fields;
mod numbers;

pub use fields::*;
pub use numbers::*;

pub type SigLocked = Signal<bool>;

pub fn init() {
    Numbers::init();
    Fields::init();
}
