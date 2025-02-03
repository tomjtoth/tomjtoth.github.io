use std::rc::Rc;

#[derive(Clone, PartialEq)]
pub(crate) struct Song {
    pub(crate) title: String,
    pub(crate) lyrics: Option<String>,
}

pub(crate) type Songs = Rc<Vec<Song>>;
