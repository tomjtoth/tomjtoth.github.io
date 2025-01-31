use dioxus::prelude::*;

use crate::hooks::{BatMonConf, SigBatMon};

#[component]
pub fn Controls() -> Element {
    let mut batmon = use_context::<SigBatMon>();
    let BatMonConf {
        min_val,
        max_val,
        allowed,
    } = batmon.read().read_conf();
    let state = {
        let r = batmon.read();
        r.get_state()
    };
    let disabled = !state.is_some();

    rsx! {
        label { r#for: "bat-mon-allowed", class: "clickable", "sallittu:" }
        input {
            id: "bat-mon-allowed",
            r#type: "checkbox",
            checked: allowed,
            class: "clickable",
            disabled,
            onchange: move |_| {
                batmon.write().toggle();
            },
        }
        input {
            id: "bat-mon-min",
            r#type: "number",
            class: "TODO",
            value: min_val,
            // max: 50,
            min: 10,
            disabled,
            title: "alaraja",
            onchange: move |evt| {
                if let Ok(as_u8) = evt.value().parse::<u8>() {
                    batmon.write().set_min(as_u8);
                }
            },
        }


        strong { id: "bat-mon-hud", class: "bordered",
            if let Some(s) = state {
                if s.charging {
                    "⚡"
                } else {
                    if (max_val).abs_diff(s.level) < (min_val).abs_diff(s.level) {
                        "🔋"
                    } else {
                        "🪫"
                    }
                }
                " {s.level}%"
            }
        }
        input {
            id: "bat-mon-max",
            r#type: "number",
            class: "TODO",
            value: max_val,
            max: 90,
            min: 50,
            disabled,
            title: "yläraja",
            onchange: move |evt| {
                if let Ok(as_u8) = evt.value().parse::<u8>() {
                    batmon.write().set_max(as_u8);
                }
            },
        }
    }
}

// export default function ControlForm({ setModal }: ControlFormProps) {
//   const dispatch = useAppDispatch();
//   const { min_val, max_val, allowed } = useAppSelector((s) => s.batteryMonitor);
//   const { isSupported, loading, charging, level } =
//     useBattery() as BatteryState;
//   const lvl100 = Math.round(level * 100);

//   let className;
//   if (min_val > max_val) className = "invalid";

//   const { reset: resetAllow, ...allow } = useField("checkbox", {

//   });

//   const { reset: _resetMin, ...min } = useField("number", {
//     id: "bat-mon-min",
//     className,
//     initially: min_val,
//     max: 50,
//     min: 10,
//     title: "alaraja",
//   });

//   const { reset: _resetMax, ...max } = useField("number", {
//     id: "bat-mon-max",
//     className,
//     initially: max_val,
//     max: 90,
//     min: 50,
//     title: "yläraja",
//   });

//   useEffect(() => {
//     const id = setTimeout(() => {
//       dispatch(
//         setLevels({
//           min_val: min.value as number,
//           max_val: max.value as number,
//         })
//       );
//     }, 300);

//     return () => clearTimeout(id);
//   }, [min.value, max.value]);

//   useEffect(() => {
//     const dp = () => dispatch(setAllowed(allow.checked));

//     if (allow.checked) {
//       checkPermission(setModal).then((notiAllowed) => {
//         if (notiAllowed) dp();
//         else resetAllow();
//       });
//     } else dp();
//   }, [allow.checked]);

//   return (
//     isSupported && (
//
//     )
//   );
// }
