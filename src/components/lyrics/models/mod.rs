mod active;
mod albums;
mod artists;
mod parser;
mod songs;

pub use active::CxActive;
pub use albums::*;
pub use artists::CxArtists;
pub use songs::*;

pub fn init() {
    CxArtists::init();
    CxActive::init();
}
