use crate::components::arx_fatalis::models::runes::Rune;

pub struct Inner {
    pub queue: Vec<Rune>,
    pub index: usize,
    pub paused: bool,
}

impl Default for Inner {
    fn default() -> Self {
        Inner {
            queue: vec![],
            index: 0,
            paused: true,
        }
    }
}
