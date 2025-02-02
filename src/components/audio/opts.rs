pub enum AudioOpt {
    Volume(f64),
    StartsAt(f64),
    NextStartsAt(f64),
    NotAvailable,
}

pub type AudioOpts = Vec<AudioOpt>;
pub type AudioSrc = (String, AudioOpts);
