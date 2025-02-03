pub(crate) struct Song {
    pub(crate) title: String,
    pub(crate) lyrics: Option<String>,
}

pub(crate) type Songs = Vec<Song>;
