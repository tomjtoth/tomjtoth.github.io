use gloo_net::http::Request;
use yew::prelude::*;

#[function_component]
fn App() -> Html {
    wasm_bindgen_futures::spawn_local(async move {
        let res = Request::get("/modal.mp3").send().await.unwrap();
        if let Some(sad) = res.body() {
            let x = web_sys::HtmlAudioElement::new().unwrap();
            x.set_src("/modal.mp3");
        }

        assert_eq!(res.status(), 200);
    });

    html! {
        <div>
            <button>{ "+1" }</button>
            <p>{ "asd" }</p>
        </div>
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
