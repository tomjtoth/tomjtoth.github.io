import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { tSS } from "../../reducers";
import { PlaybackState as PB } from "../../types";

import { CLASSES } from "./classes";

export function SpeechControls() {
  const dispatch = useAppDispatch();
  const [showOpts, setShowOpts] = useState(false);
  const ss = useAppSelector((s) => s.speechSynth);

  const opts = !showOpts ? null : (
    <div
      className="bg-blur"
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) setShowOpts(false);
      }}
    >
      <div className="p-4 fixed top-1/2 left-1/2 -translate-1/2 max-w-2/3 bg-bg-0 border rounded">
        <p className="mt-0 text-lg text-center">
          Muutokset tulee voimaan seuraavalla kappaleella.
        </p>
        <div className="grid gap-4 sm:gap-2 sm:grid-cols-[fit-content(200px)_1fr] [&_label]:text-center sm:[&_label]:text-right">
          <label htmlFor="voice-selector">ääni:</label>
          <select
            id="voice-selector"
            value={ss.voice}
            className="min-w-20"
            onChange={(ev) => dispatch(tSS.setVoice(ev.target.value))}
          >
            {ss.selectables.map((v, i) => (
              <option key={i} value={i}>
                {v.lang}: {v.name}
              </option>
            ))}
          </select>
          <label htmlFor="voice-rate">rate [{ss.rate}]:</label>
          <input
            id="voice-rate"
            type="range"
            step={0.1}
            min={0.5}
            max={4}
            value={ss.rate}
            onChange={(ev) => dispatch(tSS.setRate(ev.target.value))}
          />
          <label htmlFor="voice-pitch">pitch [{ss.pitch}]:</label>
          <input
            id="voice-pitch"
            type="range"
            step={0.1}
            min={0}
            max={2}
            value={ss.pitch}
            onChange={(ev) => dispatch(tSS.setPitch(ev.target.value))}
          />
        </div>
      </div>
    </div>
  );

  return ss.playback.state === PB.Stopped ? null : (
    <>
      {opts}
      <div className={CLASSES.join(" ")}>
        <span
          title="asetukset"
          className="clickable"
          onClick={() => setShowOpts(true)}
        >
          🤖
        </span>
        {ss.playback.state === PB.Paused ? (
          <span onClick={() => dispatch(tSS.resume())}>▶️</span>
        ) : (
          <span onClick={() => dispatch(tSS.pause())}>⏸️</span>
        )}
        <div className="flex flex-col items-center">
          <progress value={ss.playback.progress} className="w-20" />
          <sub>{Math.round(ss.playback.progress * 100)} %</sub>
        </div>
        <span onClick={() => dispatch(tSS.stop())}>⏹️</span>
      </div>
    </>
  );
}
