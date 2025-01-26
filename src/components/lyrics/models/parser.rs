use serde::Deserialize;
use std::collections::HashMap;

pub type Artists = HashMap<String, Artist>;

#[derive(Debug, Deserialize)]
pub struct Artist {
    pub url: Option<String>,
    #[serde(flatten)]
    pub albums: HashMap<String, Album>,
}

pub type Songs = HashMap<String, Option<String>>;

#[derive(Debug, Deserialize)]
pub struct Album {
    pub url: Option<String>,
    pub year: Option<u16>,
    #[serde(flatten)]
    pub songs: Songs,
}
