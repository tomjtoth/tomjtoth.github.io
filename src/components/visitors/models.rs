use chrono::NaiveDateTime;

pub type DT = NaiveDateTime;

#[derive(PartialEq, Debug, Clone)]
pub struct Visitor {
    pub name: &'static str,
    pub arrival: DT,
    pub departure: Option<DT>,
}
