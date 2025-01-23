use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use dioxus::logger::tracing;
use once_cell::sync::Lazy;

use super::models::Visitor;

// fn utc_from(str: &str) -> Result<DateTime<Utc>> {
//     if let Ok(dt) = Utc.timestamp_opt(555, 0) {
//         Ok(dt)
//     } else {
//         Err(_)
//     }
// }

pub static VISITORS: Lazy<Vec<Visitor>> = Lazy::new(|| {
    let conf = [
        ("öcséém", "2022-06-01 12:00", ""),
        ("Bálint + dr. Nő", "2023-09-01 06:30", ""),
        ("valaki", "2025-01-24 17:30", ""),
    ];

    let fmt = "%Y-%m-%d %H:%M";

    conf.into_iter()
        .map(|(name, arrival, departure)| {
            let arrival = NaiveDateTime::parse_from_str(arrival, fmt).unwrap();
            let departure = if let Ok(parsed) = NaiveDateTime::parse_from_str(departure, fmt) {
                Some(parsed)
            } else {
                None
            };

            Visitor {
                name,
                arrival,
                departure,
            }
        })
        .collect()
});
