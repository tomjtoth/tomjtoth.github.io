use super::songs::Songs;

pub(crate) struct Album {
    pub(crate) title: String,
    pub(crate) url: Option<String>,
    pub(crate) year: Option<u16>,
    pub(crate) songs: Songs,
}

pub(crate) type Albums = Vec<Album>;
