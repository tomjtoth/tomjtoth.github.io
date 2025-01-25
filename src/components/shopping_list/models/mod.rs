mod active;
mod items;
mod recipes;

pub use active::*;
pub use items::*;
pub use recipes::*;

pub static RECIPES_ID: &'static str = "slr";

pub fn init() {
    Active::init();
    Items::init();
    Recipes::init();
}
