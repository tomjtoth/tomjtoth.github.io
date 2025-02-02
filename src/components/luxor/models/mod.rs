use dioxus::signals::Signal;

mod bug;
mod fields;
mod numbers;

pub use bug::Bugstate;
pub use fields::*;
pub use numbers::CxNumbers;

pub type SigLocked = Signal<bool>;

pub fn init() {
    CxNumbers::init();
}
