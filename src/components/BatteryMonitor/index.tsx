import { useBattery } from "react-use";
import { useContext, useEffect } from "react";

import { CxSpinner } from "../Spinner";
import { useAppSelector } from "../../hooks";
import { pluggedInStr, unpluggedStr, notiText } from "./notifications";
import { BatteryState } from "../../types/battery-monitor";

import "./battery-monitor.css";

import Header from "../Header";
import Controls from "./Controls";
import MainView from "../MainView";

export default function BatteryMonitor() {
  const { lower, upper, allowed } = useAppSelector((s) => s.batteryMonitor);
  const { isSupported, loading, charging, level } =
    useBattery() as BatteryState;
  const lvl100 = Math.round(level * 100);

  const spinner = useContext(CxSpinner)!;

  useEffect(() => {
    if (loading) spinner.show();
    else spinner.hide();
  }, [loading]);

  return (
    <>
      <Header title="akunvalvonta" icon="🔋">
        <Controls />
      </Header>
      <MainView className="padded">
        <p>
          Tää työkalu {isSupported && allowed ? "hälyttää" : "hälyttäisisi"} kun
          akun taso on
        </p>
        <ul>
          <li>
            joko yli {isSupported ? `${upper}%` : "maksimirajaa"} {pluggedInStr}
          </li>
          <li>
            tai alle {isSupported ? `${lower}%` : "minimirajaa"} {unpluggedStr}
          </li>
        </ul>
        {isSupported ? (
          <>
            <p>
              {allowed ? (
                <>
                  Kerran minuutissa (ala- ja ylärajojen säätö nollaa ajastimen)
                  katsotaan mikä akun tilanne on ja hälytetään tarvittaessa.
                </>
              ) : (
                <>
                  Jotta hälytykset tulisi, siun pitää sallia työkalun pyörimistä
                  taustalla.
                </>
              )}{" "}
              Sillä, et sivuston mikä näkymä on aktiivinen, ei oo väliä, jos
              vaan pidät tämän välilehden auki.
            </p>
            <p>
              <strong>{notiText(charging, lvl100)}</strong>
            </p>
          </>
        ) : (
          <p>
            Valitettavasti tämä selain <strong>ei tue tätä toimintaa.</strong>{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery#browser_compatibility"
              target="_blank"
            >
              Tästä taulukosta
            </a>{" "}
            näkyy, mitkä selaimet tuetaan nykyään.
          </p>
        )}
      </MainView>
    </>
  );
}
