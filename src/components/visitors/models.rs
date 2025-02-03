pub(crate) type Utc = chrono::DateTime<chrono::Utc>;
pub(crate) type OptUtc = Option<Utc>;
pub(crate) type ParsedUtc = Result<Utc, Box<dyn std::error::Error>>;

#[derive(PartialEq, Debug)]
pub(crate) struct Visitor {
    pub(crate) name: &'static str,
    pub(crate) arrival: OptUtc,
    pub(crate) departure: OptUtc,
}
