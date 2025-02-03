#[derive(Clone)]
pub(crate) struct Bugstate {
    pub(crate) class: Option<&'static str>,
    pub(crate) left: String,
    pub(crate) blurred: bool,
}

impl Default for Bugstate {
    fn default() -> Self {
        Bugstate {
            class: None,
            left: "110vw".to_string(),
            blurred: false,
        }
    }
}
