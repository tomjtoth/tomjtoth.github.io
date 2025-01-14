import { useState } from "react";

import { Noti } from "./types";
import useLogic from "./logic";
import { runes, RE } from "./config";

import "./arx-fatalis.css";

import Header from "../Header";
import ControlForm from "./ControlForm";
import MainView from "../MainView";
import Runes from "./Runes";

export default function ArxFatalis() {
  const [queue, setQueue] = useState<RE[]>([]);
  const [noti, setNoti] = useState<Noti>();

  useLogic({ queue, setQueue, noti, setNoti });

  return (
    <>
      <Header title="riimut">
        <ControlForm noti={noti} />
      </Header>
      <MainView
        className="arx-fatalis"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName == "IMG")
            setQueue(
              queue.concat(
                runes.findIndex(
                  ({ rune }) => rune === (e.target as HTMLImageElement).title
                )!
              )
            );
        }}
      >
        <div id="runes-drawing">{/* TODO: implement drawing by finger */}</div>
        <Runes />
      </MainView>
    </>
  );
}
