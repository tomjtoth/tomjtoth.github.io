use serde::Deserialize;
use std::collections::HashMap;

pub(crate) type Artists = HashMap<String, Artist>;

#[derive(Debug, Deserialize)]
pub(crate) struct Artist {
    pub(crate) url: Option<String>,
    #[serde(flatten)]
    pub(crate) albums: HashMap<String, Album>,
}

pub(crate) type Songs = HashMap<String, Option<String>>;

#[derive(Debug, Deserialize)]
pub(crate) struct Album {
    pub(crate) url: Option<String>,
    pub(crate) year: Option<u16>,
    #[serde(flatten)]
    pub(crate) songs: Songs,
}
