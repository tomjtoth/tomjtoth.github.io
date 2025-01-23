use chrono::NaiveDateTime;
use dioxus::{logger::tracing, prelude::*};
use fancy_regex::{Regex, RegexBuilder};
use once_cell::sync::Lazy;

use super::models::Visitor;

static RE_CONSONANT: Lazy<Regex> = Lazy::new(|| {
    RegexBuilder::new(r"^[bcdfghjklmnpqrstvwxz]")
        .case_insensitive(true)
        .build()
        .unwrap()
});

pub fn text(next: Option<&Visitor>, now: NaiveDateTime) -> Element {
    let class = "visitor hu";

    if let Some(next) = next {
        let coming = format!(
            "{} {} ",
            if next.name.contains("+") {
                "Jönnek"
            } else {
                "Jön"
            },
            if RE_CONSONANT.is_match(next.name).unwrap() {
                "a"
            } else {
                "az"
            }
        );

        let duration = next.arrival - now;
        let ddd = duration.num_days();
        let hh = duration.num_hours().rem_euclid(24);
        let mm = duration.num_minutes().rem_euclid(60);
        let ss = duration.num_seconds().rem_euclid(60);

        tracing::debug!(ddd, hh, mm, ss);

        if ddd < 3 {
            rsx! {
                span {
                    class,
                    "{coming}"
                    {format!(
                        "{} {:02}:{:02}:{:02} múlva",
                        next.name,
                        duration.num_hours(),
                        mm,
                        ss
                    )}
                }
            }
        } else if ddd < 7 {
            rsx! {
                "{coming}"
                span {
                    class,
                    "{next.name} {ddd} nap"
                }
                {format!(" {:02}:{:02}:{:02} múlva", hh, mm, ss)}
            }
        } else {
            rsx! {
                "{coming}"
                span {
                    class,
                    "{next.name}"
                }
                {format!(" {ddd} nap {:02}:{:02}:{:02} múlva", hh, mm, ss)}
            }
        }
    } else {
        rsx! { "nincs új látogató a láthatáron!" }
    }
}
