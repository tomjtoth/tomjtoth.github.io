import { useSpinner, useAppSelector } from "../../hooks";
import { ViewHeader, ViewContent } from "..";

import Controls from "./Controls";

const pluggedInStr = "ja laturi on vieläkin kiinni";
const unpluggedStr = "eikä laturi oo kytkettynä";

export function notiText(charging: boolean, level: number) {
  return `Akun taso on nyt ${level}% ${charging ? pluggedInStr : unpluggedStr}`;
}

export function BatteryMonitor() {
  const conf = useAppSelector((s) => s.batteryMonitor.conf);
  const state = useAppSelector((s) => s.batteryMonitor.state);
  const isSupported = useAppSelector((s) => s.batteryMonitor.isSupported);

  const loaded = isSupported && state !== undefined && conf !== undefined;
  useSpinner(loaded);

  return (
    <>
      <ViewHeader title="akunvalvonta">
        {isSupported && conf && <Controls />}
      </ViewHeader>
      <ViewContent className="p-4">
        <p>
          Tää työkalu {state && conf?.allowed ? "hälyttää" : "hälyttäisi"} kun
          akun taso on
        </p>
        <ul>
          <li>
            joko yli {isSupported && conf ? `${conf.upper}%` : "maksimirajaa"}{" "}
            {pluggedInStr}
          </li>
          <li>
            tai alle {isSupported && conf ? `${conf.lower}%` : "minimirajaa"}{" "}
            {unpluggedStr}
          </li>
        </ul>
        {isSupported ? (
          <>
            <p>
              {conf?.allowed ? (
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
      </ViewContent>
    </>
  );
}
