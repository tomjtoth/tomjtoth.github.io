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
        ("öcséém", "2022-06-01T12:00", ""),
        ("Bálint + dr. Nő", "2023-09-01T06:30", "2023-09-03T18:30"),
        // ("test user", "2025-01-28T18:30", "2025-01-23T18:30"),
    ];

    let fmt = "%Y-%m-%dT%H:%M";

    let res: Vec<Visitor> = conf
        .into_iter()
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
        .collect();

    tracing::debug!("parsed config is {} long", res.len());

    res
});
