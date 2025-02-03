use dioxus::{logger::tracing, prelude::*};
use js_sys::Promise;
use wasm_bindgen::{prelude::*, JsValue};
use wasm_bindgen_futures::JsFuture;
use web_sys::window;

#[derive(Clone)]
pub(crate) struct BatteryState {
    pub(crate) charging: bool,
    pub(crate) level: u8,
    pub(crate) battery_present: bool,
}

pub(crate) struct BatMan {
    pub(crate) loading: bool,
    pub(crate) state: Option<BatteryState>,
}

pub(crate) type UseBattery = Signal<BatMan>;

pub(crate) fn use_battery() -> UseBattery {
    let mut batman = use_signal(|| BatMan {
        loading: true,
        state: None,
    });

    use_future(move || async move {
        let res_bm = get_battery_manager().await;
        if let Ok(bm) = res_bm {
            let mut update = {
                let bm = bm.clone();
                move || {
                    tracing::debug!("on_change closure triggered");

                    let mut w = batman.write();
                    w.state = Some(BatteryState {
                        level: (bm.level() * 100.0) as u8,
                        charging: bm.charging(),
                        battery_present: bm.charging_time().is_finite()
                            || bm.discharging_time().is_finite(),
                    })
                }
            };

            update();

            let on_change = Closure::wrap(Box::new(move || {
                update();
            }) as Box<dyn FnMut()>);

            bm.set_onlevelchange(Some(on_change.as_ref().unchecked_ref()));
            bm.set_onchargingchange(Some(on_change.as_ref().unchecked_ref()));
            bm.set_onchargingtimechange(Some(on_change.as_ref().unchecked_ref()));
            bm.set_ondischargingtimechange(Some(on_change.as_ref().unchecked_ref()));

            on_change.forget();
        }
        batman.write().loading = false;
    });

    batman
}

async fn get_battery_manager() -> Result<web_sys::BatteryManager, JsValue> {
    let window = window().expect("no global `window` exists");
    let navigator = window.navigator();

    // Call navigator.getBattery() using js_sys
    let battery_promise: Promise =
        js_sys::Reflect::get(&navigator, &JsValue::from_str("getBattery"))?
            .dyn_into::<js_sys::Function>()?
            .call0(&navigator)?
            .dyn_into()?;

    let battery = JsFuture::from(battery_promise).await?;
    let battery_manager: web_sys::BatteryManager = battery.dyn_into()?;

    Ok(battery_manager)
}
