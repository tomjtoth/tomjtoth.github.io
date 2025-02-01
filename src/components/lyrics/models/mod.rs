mod active;
mod albums;
mod artists;
mod parser;
mod songs;

pub use active::*;
pub use albums::*;
pub use artists::CxArtists;
pub use songs::*;

pub fn init() {
    CxArtists::init();
    Active::init();
}
