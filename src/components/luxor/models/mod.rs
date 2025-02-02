use dioxus::signals::Signal;

mod bug;
mod fields;
mod numbers;

pub use bug::Bugstate;
pub use fields::*;
pub use numbers::*;

pub type SigLocked = Signal<bool>;
