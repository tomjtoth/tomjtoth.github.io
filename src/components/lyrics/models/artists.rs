use dioxus::signals::Signal;

use super::albums::Albums;

#[derive(Clone, PartialEq)]
pub struct Artist {
    pub name: String,
    pub url: Option<String>,
    pub albums: Albums,
}

pub struct Artists(Vec<Artist>);
pub type SigArtists = Signal<Artists>;

impl Default for Artists {
    fn default() -> Self {
        Artists(vec![])
    }
}

impl Artists {
    pub fn iter(&self) -> std::slice::Iter<Artist> {
        self.0.iter()
    }

    pub fn get(&self, index: usize) -> &Artist {
        self.0.get(index).unwrap()
    }

    pub fn from(parsed: Vec<Artist>) -> Self {
        Artists(parsed)
    }
}
