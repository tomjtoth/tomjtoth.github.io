use std::rc::Rc;

#[derive(Clone, PartialEq)]
pub struct Song {
    pub title: String,
    pub lyrics: Option<String>,
}

pub type Songs = Rc<Vec<Song>>;
