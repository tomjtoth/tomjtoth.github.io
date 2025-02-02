mod active;
mod items;
mod recipes;

pub use active::*;
pub use items::*;
pub use recipes::CxRecipes;

pub static RECIPES_ID: &'static str = "slr";

pub fn init() {
    CxRecipes::init();
}
