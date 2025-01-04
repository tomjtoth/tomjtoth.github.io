import { useBattery } from "react-use";

import "./battery-monitor.css";

import Loader from "../Loader";
import Header from "../Header";
import Modal from "../Modal";
import ControlForm from "./ControlForm";
import MainView from "../MainView";
import { useState } from "react";

export default function () {
  const [modal, setModal] = useState({});
  const { isSupported, loading, charging, level } = useBattery();
  const lvl100 = Math.round(level * 100);

  return (
    <>
      <Modal {...{ modal, setModal }} />
      <Header title="akunvalvonta" icon="🔋">
        <ControlForm {...{ setModal }} />
      </Header>
      <MainView className="battery-monitor">
        <p>Tää työkalu hälyttää kun akun taso on</p>
        <ul>
          <li>joko yli maksimirajaa ja laturi on kiinni</li>
          <li>tai alle minimirajaa eikä laturi oo kytkettynä</li>
        </ul>
        {isSupported ? (
          loading ? (
            <Loader />
          ) : (
            <p>
              Akun taso on{" "}
              <strong>
                nyt {lvl100}%{" "}
                {charging ? "ja laturi on kiinni" : "eikä laturi oo kytkettynä"}
              </strong>
            </p>
          )
        ) : (
          <p>
            Valitettavasti tämä selain <strong>ei tue tätä toimintaa.</strong>
          </p>
        )}
      </MainView>
    </>
  );
}
