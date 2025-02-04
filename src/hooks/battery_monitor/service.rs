use std::time::Duration;

use dioxus::{logger::tracing, prelude::*};
use gloo_timers::future::sleep;

use super::*;

pub fn use_service() -> UseFuture {
    use_future(|| async {
        if BATMON.loaded() {
            let minute = Duration::from_secs(60);
            while let (
                BatMonConf {
                    allowed: true,
                    lower,
                    upper,
                },
                Some(s),
            ) = {
                let c = BATMON.with(|r| r.conf.clone());
                let bm = BATMON.with(|r| r.state.clone());
                (c, bm)
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
        }
    })
}
