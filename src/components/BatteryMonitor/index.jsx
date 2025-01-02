import { useBattery } from "react-use";
import { useState, useEffect } from "react";
import Header from "../Header";
import MainView from "../MainView";
import { useField } from "../../hooks";
import { notify, checkPermission } from "./Notification";
import "./battery-monitor.css";

const SEC = 1000;

export default function () {
  const {
    isSupported,
    level,
    loading,
    charging,
    chargingTime,
    dischargingTime,
  } = useBattery();
  const lvl100 = Math.round(level * 100);

  const [prev, update] = useState({ level: 100, charging: false });

  const { reset: _resetMin, ...min } = useField("number", {
    initially: 20,
    max: 100,
    min: 0,
  });
  const { reset: _resetMax, ...max } = useField("number", {
    initially: 80,
    max: 100,
    min: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSupported && (level !== prev.level || charging !== prev.charging)) {
        update({ level, charging });

        if (
          (chargingTime !== Infinity && charging && lvl100 >= max.value) ||
          (dischargingTime !== Infinity && !charging && lvl100 <= min.value)
        ) {
          notify(
            `Akun taso on nyt ${lvl100}% ${
              charging ? "ja laturi on kiinni" : "eikä laturi oo kytkettynä"
            }`
          );
        }
      }
    }, 30 * SEC);

    return () => clearInterval(interval);
  }, [level, charging, chargingTime, dischargingTime, min.value, max.value]);

  checkPermission();

  return (
    <>
      <Header title="akunvalvonta" icon="🔋">
        {isSupported ? (
          loading ? (
            <p>hetki pieni...</p>
          ) : (
            <>
              <p>
                Akun taso on{" "}
                <strong>
                  nyt {lvl100}%{" "}
                  {charging
                    ? "ja laturi on kiinni"
                    : "eikä laturi oo kytkettynä"}
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
          )
        ) : (
          <p>
            Valitettavasti tämä selain <strong>ei tue tätä toimintaa.</strong>
          </p>
        )}
      </Header>
      <MainView>
        <div id="battery-monitor">
          <p>Tää työkalu hälyttää kun akun taso on</p>
          <ul>
            <li>joko yli maksimirajaa ja laturi on kiinni</li>
            <li>tai alle minimirajaa eikä laturi oo kytkettynä</li>
          </ul>
        </div>
      </MainView>
    </>
  );
}
