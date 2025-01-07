import { useState } from "react";

import useLogic from "./logic";

import "./arx-fatalis.css";

import Header from "../Header";
import ControlForm from "./ControlForm";
import MainView from "../MainView";
import Runes from "./Runes";

export default function ArxFatalis() {
  const [queue, setQueue] = useState([]);
  const [noti, setNoti] = useState();

  useLogic(queue, setQueue, noti, setNoti);

  return (
    <>
      <Header title="riimut">
        <ControlForm noti={noti} />
      </Header>
      <MainView
        className="arx-fatalis"
        onClick={(e) => {
          if (e.target.tagName == "IMG") setQueue(queue.concat(e.target.title));
        }}
      >
        <div id="runes-drawing">{/* TODO: implement drawing by finger */}</div>
        <Runes />
      </MainView>
    </>
  );
}
