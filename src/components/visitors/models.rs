pub type Utc = chrono::DateTime<chrono::Utc>;
pub type OptUtc = Option<Utc>;
pub type ParsedUtc = Result<Utc, Box<dyn std::error::Error>>;

#[derive(PartialEq, Debug)]
pub struct Visitor {
    pub name: &'static str,
    pub arrival: OptUtc,
    pub departure: OptUtc,
}
