import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { runes, spells } from "./config";
import { castSpell } from "../../reducers/runes";

import "./runes.css";

import Header from "../Header";
import MainView from "../MainView";

const SEC = 1000;

export default function () {
  const [queue, setQueue] = useState([]);
  const [noti, setNoti] = useState();
  const [idx, setIdx] = useState(0);
  const dispatch = useDispatch();
  const { score } = useSelector((s) => s.runes);

  useEffect(() => {
    const toId = setTimeout(() => setNoti(null), 5 * SEC);

    return () => clearTimeout(toId);
  }, [noti]);

  useEffect(() => {
    console.log(idx, queue);

    // TODO: not working when caching many of the same rune after one another
    if (idx < queue.length) {
      const curr = runes[queue[idx]];
      if (curr.mp3.paused) {
        curr.mp3.currentTime = curr.start;
        curr.mp3.play();

        setTimeout(() => {
          setIdx(idx + 1);
        }, curr.length);
      }
    } else if (idx > 0) {
      let validSpell = false;

      for (const [spell, { page, sequence, mp3 }] of Object.entries(spells)) {
        if (sequence.length !== idx) continue;

        validSpell = true;

        for (let i = 0; i < idx; i++) {
          if (queue[i] !== sequence[i]) {
            validSpell = false;
            break;
          }
        }

        if (validSpell) {
          setNoti({ spell, page, sequence });
          dispatch(castSpell(spell));
          if (mp3) {
            mp3.currentTime = 0;
            mp3.play();
          }
          break;
        }
      }

      setQueue(queue.slice(idx));
      setIdx(0);
    }
  }, [queue, idx]);

  return (
    <>
      <Header title="riimut">
        💎 {score}
        <a
          className="runes"
          href="https://wiki.arx-libertatis.org/Spells"
          target="_blank"
        >
          📖
        </a>
        {noti && (
          <>
            {noti.spell} ({noti.sequence.join(" + ")}) from page {noti.page}
          </>
        )}
        {/* TODO: <span id="reset-runes-score">reset</span> */}
      </Header>
      <MainView
        className="runes"
        onClick={(e) => {
          if (e.target.tagName !== "IMG") return;

          // Pause the animation
          e.target.style.animationPlayState = "paused";

          // Set the currentTime property to 0
          e.target.style.animation = "none";
          e.target.offsetHeight; /* trigger reflow */
          e.target.style.animation = null;

          setQueue(queue.concat(e.target.title));
          e.stopPropagation();
        }}
      >
        <div id="runes-drawing">{/* TODO: implement drawing by finger */}</div>
        <div id="runes">
          {Object.keys(runes).map((rune) => (
            <img
              key={rune}
              {...{
                draggable: false,
                className: "clickable",
                alt: rune,
                title: rune,
                src: `/arx/runes/${rune.toLowerCase()}.png`,
              }}
            />
          ))}
        </div>
      </MainView>
    </>
  );
}
