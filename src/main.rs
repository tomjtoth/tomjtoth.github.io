use dioxus::prelude::*;
use gloo_net::http::Request;

// mod components;
// mod routes;
// mod utils;

// use components as c;

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // // init static resources
    // c::audio::init();

    // // read from localStorage
    // c::sidepanel::init();
    // c::luxor::init();

    // // also fetching from server
    // c::lyrics::init();
    // c::shopping_list::init();

    use_future(|| async {
        let res = Request::get("/modal.mp3").send().await.unwrap();
        if let Some(sad) = res.body() {
            let x = web_sys::HtmlAudioElement::new().unwrap();
            x.set_src("/modal.mp3");
        }

        assert_eq!(res.status(), 200);
    });

    rsx! {
        // Router::<routes::Route> {}
        div {
            button {
                "+1"
            }
            p {
                "asd"
            }
        }
    }
}
