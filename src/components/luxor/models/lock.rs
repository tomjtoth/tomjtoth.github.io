use dioxus::prelude::*;

pub struct Lock(bool);
type GsLock = GlobalSignal<Lock>;
pub static LOCK: GsLock = GlobalSignal::new(|| Lock(true));

/// is this actually necessary? wasn't the below
/// (as in before this commit) fool-proof?
/// ```rust
/// let sig_lock = use_signal(||true);
/// use_context_provider(|| sig_lock);
/// ```
///
pub trait TrLock {
    fn status(&self) -> bool;
    fn toggle(&self);
}

impl TrLock for GsLock {
    fn status(&self) -> bool {
        self.with(|r| r.0)
    }

    fn toggle(&self) {
        self.with_mut(|w| w.0 = !w.0);
    }
}
