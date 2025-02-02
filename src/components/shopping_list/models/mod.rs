mod active;
mod items;
mod recipes;

pub use active::*;
pub use items::CxItems;
pub use recipes::CxRecipes;

pub static RECIPES_ID: &'static str = "slr";

pub fn init() {
    CxItems::init();
    CxRecipes::init();
}
