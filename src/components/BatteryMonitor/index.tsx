import useBatMon from "../../hooks/battery-monitor";
import { pluggedInStr, unpluggedStr, notiText } from "./notifications";

import "./battery-monitor.css";

import Header from "../Header";
import Controls from "./Controls";
import MainView from "../MainView";

export default function BatteryMonitor() {
  const { isSupported, state, conf } = useBatMon();

  return (
    <>
      <Header title="akunvalvonta" icon="🔋">
        {conf && <Controls />}
      </Header>
      <MainView className="padded">
        <p>
          Tää työkalu{" "}
          {state && conf && conf.allowed ? "hälyttää" : "hälyttäisisi"} kun akun
          taso on
        </p>
        <ul>
          <li>
            joko yli {conf ? `${conf.upper}%` : "maksimirajaa"} {pluggedInStr}
          </li>
          <li>
            tai alle {conf ? `${conf.lower}%` : "minimirajaa"} {unpluggedStr}
          </li>
        </ul>
        {isSupported ? (
          <>
            <p>
              {conf && conf.allowed ? (
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
              {state && (
                <strong>{notiText(state.charging, state.level)}</strong>
              )}
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
