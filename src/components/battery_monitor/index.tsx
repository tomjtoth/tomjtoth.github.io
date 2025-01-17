import { useBattery } from "react-use";
import { useAppSelector } from "../../hooks";
import { pluggedInStr, unpluggedStr, notiText } from "./notifications";

import "./battery-monitor.css";

import Loader from "../Loader";
import Header from "../Header";
import Modal from "../Modal";
import ControlForm from "./ControlForm";
import MainView from "../MainView";
import { useState } from "react";
import { ModalType } from "../../types/modal";
import { BatteryState } from "../../types/battery-monitor";

export default function BatteryMonitor() {
  const [modal, setModal] = useState<ModalType>();
  const { min_val, max_val, allowed } = useAppSelector((s) => s.batteryMonitor);
  const { isSupported, loading, charging, level } =
    useBattery() as BatteryState;
  const lvl100 = Math.round(level * 100);

  return (
    <>
      <Modal {...{ modal, setModal }} />
      <Header title="akunvalvonta" icon="🔋">
        <ControlForm {...{ setModal }} />
      </Header>
      <MainView className="padded">
        <p>
          Tää työkalu {isSupported && allowed ? "hälyttää" : "hälyttäisisi"} kun
          akun taso on
        </p>
        <ul>
          <li>
            joko yli {isSupported ? `${max_val}%` : "maksimirajaa"}{" "}
            {pluggedInStr}
          </li>
          <li>
            tai alle {isSupported ? `${min_val}%` : "minimirajaa"}{" "}
            {unpluggedStr}
          </li>
        </ul>
        {isSupported ? (
          loading ? (
            <Loader />
          ) : (
            <>
              <p>
                {allowed ? (
                  <>
                    Kerran minuutissa (ala- ja ylärajojen säätö nollaa
                    ajastimen) katsotaan mikä akun tilanne on ja hälytetään
                    tarvittaessa.
                  </>
                ) : (
                  <>
                    Jotta hälytykset tulisi, siun pitää sallia työkalun
                    pyörimistä taustalla.
                  </>
                )}{" "}
                Sillä, et sivuston mikä näkymä on aktiivinen, ei oo väliä, jos
                vaan pidät tämän välilehden auki.
              </p>
              <p>
                <strong>{notiText(charging, lvl100)}</strong>
              </p>
            </>
          )
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
