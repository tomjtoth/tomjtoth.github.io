use dioxus::prelude::*;
use fancy_regex::{Regex, RegexBuilder};
use once_cell::sync::Lazy;

use super::models::{Utc, Visitor};

static RE_CONSONANT: Lazy<Regex> = Lazy::new(|| {
    RegexBuilder::new(r"^[bcdfghjklmnpqrstvwxz]")
        .case_insensitive(true)
        .build()
        .unwrap()
});

fn coming(next: &Visitor) -> String {
    format!(
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
    )
}

fn get_times(next: &Visitor, now: Utc) -> Option<[i64; 5]> {
    if let Some(utc) = next.arrival {
        let duration = utc - now;
        let ddd = duration.num_days();
        let hhh = duration.num_hours();
        let hh = hhh.rem_euclid(24);
        let mm = duration.num_minutes().rem_euclid(60);
        let ss = duration.num_seconds().rem_euclid(60);

        Some([ddd, hhh, hh, mm, ss])
    } else {
        None
    }
}

pub(crate) fn text(next: Option<&Visitor>, now: Utc) -> Element {
    let class = "visitor hu";

    if let Some(next) = next {
        let coming = coming(next);

        rsx! {
            if let Some([ddd, hhh, hh, mm, ss]) = get_times(next, now) {
                if ddd < 3 {
                    span { class,
                        "{coming}"
                        {format!("{} {:02}:{:02}:{:02} múlva", next.name, hhh, mm, ss)}
                    }
                } else if ddd < 7 {
                    "{coming}"
                    span { class, "{next.name} {ddd} nap" }
                    {format!(" {:02}:{:02}:{:02} múlva", hh, mm, ss)}
                } else {
                    "{coming}"
                    span { class, "{next.name}" }
                    {format!(" {ddd} nap {:02}:{:02}:{:02} múlva", hh, mm, ss)}
                }
            }
        }
    } else {
        rsx! { "nincs új látogató a láthatáron!" }
    }
}
