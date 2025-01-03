import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { runes, spells } from "./config";
import { castSpell } from "../../reducers/runes";

const SEC = 1000;

export default function (queue, setQueue, noti, setNoti) {
  const dispatch = useDispatch();
  const [idx, setIdx] = useState(0);

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

      if (!validSpell) {
        spells.fizzle.mp3.currentTime = 0;
        spells.fizzle.mp3.play();
      }

      setQueue(queue.slice(idx));
      setIdx(0);
    }
  }, [queue, idx]);
}
