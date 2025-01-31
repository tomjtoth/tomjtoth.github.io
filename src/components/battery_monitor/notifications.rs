pub static PLUGGED_IN_STR: &'static str = "ja laturi on vieläkin kiinni";
pub static UNPLUGGED_STR: &'static str = "eikä laturi oo kytkettynä";

pub fn noti_txt(charging: bool, lvl100: u8) -> String {
    format!(
        "Akun taso on nyt {lvl100}% {}",
        if charging {
            PLUGGED_IN_STR
        } else {
            UNPLUGGED_STR
        }
    )
}
