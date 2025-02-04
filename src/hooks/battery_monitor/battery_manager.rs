use dioxus::{logger::tracing, prelude::*};
use js_sys::Promise;
use wasm_bindgen::{prelude::*, JsValue};
use wasm_bindgen_futures::JsFuture;
use web_sys::window;

use crate::hooks::BatteryState;

use super::BATMON;

pub fn init() {
    use_future(|| async {
        let res_bm = get_battery_manager().await;
        if let Ok(bm) = res_bm {
            let update = {
                let bm = bm.clone();
                move |first_run| {
                    BATMON.with_mut(|w| {
                        w.state = Some(BatteryState {
                            level: (bm.level() * 100.0) as u8,
                            charging: bm.charging(),
                            battery_present: bm.charging_time().is_finite()
                                || bm.discharging_time().is_finite(),
                        });

                        if first_run {
                            w.loaded = true;
                        }

                        tracing::debug!("on_change closure triggered");
                    });
                }
            };

            update(true);

            let on_change = Closure::wrap(Box::new(move || {
                update(false);
            }) as Box<dyn Fn()>);

            bm.set_onlevelchange(Some(on_change.as_ref().unchecked_ref()));
            bm.set_onchargingchange(Some(on_change.as_ref().unchecked_ref()));
            bm.set_onchargingtimechange(Some(on_change.as_ref().unchecked_ref()));
            bm.set_ondischargingtimechange(Some(on_change.as_ref().unchecked_ref()));

            on_change.forget();
        }
        BATMON.with_mut(|w| {
            w.loaded = true;
            w.service.restart();
        });
    });
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
