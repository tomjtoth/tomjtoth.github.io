use std::time::Duration;

use dioxus::prelude::*;
use gloo_timers::future::sleep;

use crate::routes::Route::Home;

#[derive(Props, Clone, PartialEq)]
pub(crate) struct Props {
    path: Vec<String>,
}

/// Home page
#[component]
pub(crate) fn NotFound(props: Props) -> Element {
    let navigator = use_navigator();
    let mut counter = use_signal(|| 10u8);

    use_future(move || async move {
        let sec = Duration::from_secs(1);

        while counter() > 0 {
            sleep(sec).await;
            *counter.write() -= 1;
        }

        navigator.replace(Home)
    });

    let path = props.path.join("/");

    rsx! {
        p {
            i { "/{path}" }

            " is not implemented, you will be redirected in "
            span {
                "{counter} "

                if counter() > 1 {
                    "seconds"
                } else {
                    "second"
                }
            }
            ". Or you can click "
            Link { to: Home, "here" }
            "."
        }
    }
}
