mod active;
mod items;
mod recipes;

pub use active::CxActive;
pub use items::*;
pub use recipes::*;

pub static RECIPES_ID: &'static str = "slr";

pub fn init() {
    CxActive::init();
    CxItems::init();
    Recipes::init();
}
