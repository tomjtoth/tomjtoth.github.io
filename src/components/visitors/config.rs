use chrono::{NaiveDateTime, TimeZone};
use chrono_tz::Europe::Helsinki;
use dioxus::logger::tracing;
use once_cell::sync::Lazy;

use super::models::{OptUtc, ParsedUtc, Visitor};

static FMT: &'static str = "%Y-%m-%d %H:%M";

fn parse_str(input: &str) -> ParsedUtc {
    // Try to parse the input string into a NaiveDateTime
    let naive = NaiveDateTime::parse_from_str(input, FMT)?;
    tracing::debug!("{}", naive.to_string());

    // Try to convert the NaiveDateTime to a DateTime in the Helsinki timezone
    let with_tz = Helsinki
        .from_local_datetime(&naive)
        .single()
        .ok_or_else(|| format!("Ambiguous or invalid local time: {}", naive))?;

    let utc = with_tz.to_utc();
    tracing::debug!("as UTC: {}", utc.to_string());

    Ok(utc)
}

fn utc_from(str: &'static str) -> OptUtc {
    match parse_str(str) {
        Ok(utc) => Some(utc),
        Err(err) => {
            tracing::debug!(r#"parsing DateTime from "{str}" resulted in Err: "{err}""#);
            None
        }
    }
}

pub static VISITORS: Lazy<Vec<Visitor>> = Lazy::new(|| {
    let conf = [
        ("öcséém", "2022-06-01 12:00", ""),
        ("Bálint + dr. Nő", "2023-09-01 06:30", ""),
        ("valaki", "2025-01-24 17:30", ""),
    ];

    conf.into_iter()
        .map(|(name, arr, dep)| Visitor {
            name,
            arrival: utc_from(arr),
            departure: utc_from(dep),
        })
        .collect()
});
