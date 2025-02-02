use std::rc::Rc;

use super::songs::Songs;
#[derive(PartialEq)]
pub struct Album {
    pub title: String,
    pub url: Option<String>,
    pub year: Option<u16>,
    pub songs: Songs,
}

pub type Albums = Rc<Vec<Album>>;
