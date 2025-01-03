import { useState, useEffect } from "react";

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
        onClick={({ target }) => {
          if (target.tagName !== "IMG") return;

          // Pause the animation
          target.style.animationPlayState = "paused";

          // Set the currentTime property to 0
          target.style.animation = "none";
          target.offsetHeight; /* trigger reflow */
          target.style.animation = null;

          setQueue(queue.concat(target.title));
        }}
      >
        <div id="runes-drawing">{/* TODO: implement drawing by finger */}</div>
        <Runes />
      </MainView>
    </>
  );
}
