import { useState } from "react";

import useLogic from "./logic";

import "./runes.css";

import Header from "../Header";
import ControlForm from "./ControlForm";
import MainView from "../MainView";
import Runes from "./Runes";

export default function () {
  const [queue, setQueue] = useState([]);
  const [noti, setNoti] = useState();

  useLogic(queue, setQueue, noti, setNoti);

  return (
    <>
      <Header title="riimut">
        <ControlForm noti={noti} />
      </Header>
      <MainView
        className="runes"
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
