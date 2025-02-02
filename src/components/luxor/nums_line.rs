use dioxus::{logger::tracing, prelude::*};

use crate::{
    components::{
        luxor::models::*,
        modal::{Button, CxModal, Language},
    },
    utils::DisplayBytes,
};

#[component]
pub fn PickedNumsLine() -> Element {
    let mut modal = use_context::<CxModal>();

    let mut bug = use_signal(|| Bugstate::default());

    let nums_len = NUMBERS.len();

    let lower = {
        if nums_len > 10 {
            nums_len - 10
        } else {
            0
        }
    };

    let last10_nums = NUMBERS.get_rg(lower, nums_len).to_vec();

    let deleter_style = if nums_len > 0 {
        None
    } else {
        Some("visibility:hidden;")
    };

    rsx! {
        div { id: "luxor-picked-nums-line",

            if nums_len > 10 {
                "..."
            }
            "{last10_nums.displ_as_dec()}"

            if bug.read().blurred {
                div {
                    id: "luxor-num-bug-priv-filter",
                    style: "left: {bug.read().left};",
                    onanimationend: move |_| {
                        bug.set(Bugstate {
                            class: Some("crawling"),
                            left: "-10vw".to_string(),
                            blurred: false,
                        });
                    },
                }
            }

            span {
                class: "clickable",
                style: deleter_style,
                onclick: move |evt| {
                    let data = evt.map(|data| data.client_coordinates());
                    let left = format!("{}px", data.data().x - 8.0);
                    modal
                        .lang(Language::Hu)
                        .buttons(
                            vec![
                                (
                                    Button::Ok,
                                    Some(
                                        use_callback(move |_| {
                                            tracing::debug!("bug comes in");
                                            bug.set(Bugstate {
                                                class: Some("crawling"),
                                                left: left.to_owned(),
                                                blurred: false,
                                            });
                                        }),
                                    ),
                                ),
                                (Button::Cancel, None),
                            ],
                        )
                        .prompt(rsx! {
                            "Törlöm az "
                            strong { "utolsó" }
                            " húzott számot"
                        })
                },
                "⬅️"
            }

            div {
                id: "luxor-num-bug",
                class: bug.read().class,
                style: "left: {bug.read().left};",
                ontransitionend: {
                    move |_| {
                        if bug.read().left == "-10vw".to_string() {
                            tracing::debug!("bug returns to right unseen");
                            bug.set(Bugstate {
                                left: "110vw".to_string(),
                                class: None,
                                blurred: false,
                            })
                        } else {
                            tracing::debug!("bug's privacy filter on");
                            let left = bug.read().clone().left;
                            let class = bug.read().class;
                            bug.set(Bugstate {
                                left,
                                class,
                                blurred: true,
                            });
                            tracing::debug!("removing last number");
                            NUMBERS.rm_last()
                        }
                    }
                },
                "🪲"
            }
        }
    }
}
