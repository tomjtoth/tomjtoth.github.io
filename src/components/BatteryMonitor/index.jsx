import { useBattery } from "react-use";
import { useState, useEffect } from "react";
import { header } from "../NavBar";
import useField from "../../hooks/useField";
import { show_notification, check_permission } from "./Notification";

const SEC = 1000;

export default function () {
  const battery = useBattery();
  const { isSupported, level, charging, chargingTime, dischargingTime } =
    battery;
  const lvl100 = Math.round(level * 100);

  const [prev, update] = useState({ level: 100, charging: false });

  const min = useField("number", "20");
  const max = useField("number", "80");

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSupported && (level !== prev.level || charging !== prev.charging)) {
        update({ level, charging });
        console.log(battery);

        if (
          (chargingTime != Infinity &&
            charging &&
            lvl100 >= Number(max.value)) ||
          (dischargingTime != Infinity &&
            !charging &&
            lvl100 <= Number(min.value))
        ) {
          show_notification(`Current level: ${lvl100}%`);
        }
      }
    }, 1 * SEC);

    return () => clearInterval(interval);
  }, [level, charging, chargingTime, dischargingTime, min.value, max.value]);

  check_permission();

  return (
    <>
      {header("akunvalvonta")}
      <p>Tää työkalu hälyttää kun akun taso on</p>
      <ul>
        <li>joko yli maksimirajaa ja laturi on kiinni</li>
        <li>tai alle minimirajaa eikä laturi oo kytkettynä</li>
      </ul>
      {isSupported ? (
        <>
          <p>
            Akun taso on{" "}
            <strong>
              nyt {lvl100} %{" "}
              {charging ? "ja laturi on kiinni" : "eikä laturi oo kytkettynä"}
            </strong>
          </p>
          <div>
            <label htmlFor="bat-mon-max">yläraja:</label>
            <input id="bat-mon-max" {...max}></input>
          </div>
          <div>
            <label htmlFor="bat-mon-min">alaraja:</label>
            <input id="bat-mon-min" {...min}></input>
          </div>
          {max.value < min.value && <p>arvot menee ristiin</p>}
        </>
      ) : (
        <>
          Valitettavasti tämä selain <strong>ei tue tätä toimintaa.</strong>
        </>
      )}
    </>
  );
}
