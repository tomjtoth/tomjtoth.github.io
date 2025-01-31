#[derive(Clone)]
pub struct Bugstate {
    pub class: Option<&'static str>,
    pub left: String,
    pub blurred: bool,
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
