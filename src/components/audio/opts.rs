pub(crate) enum AudioOpt {
    Volume(f64),
    StartsAt(f64),
    NextStartsAt(f64),
    NotAvailable,
}

pub(crate) type AudioOpts = Vec<AudioOpt>;
pub(crate) type AudioSrc = (String, AudioOpts);
