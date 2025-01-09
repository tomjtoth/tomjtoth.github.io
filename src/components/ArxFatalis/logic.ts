import { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks";

import { runes, spells, fizzle, RE } from "./config";
import { Noti, setQueueType, setNotiType } from "./types";
import { castSpell } from "../../reducers/arx-fatalis";

const SEC = 1000;

export default function (
  queue: RE[],
  setQueue: setQueueType,
  noti: Noti,
  setNoti: setNotiType
) {
  const dispatch = useAppDispatch();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const toId = setTimeout(() => setNoti(undefined), 5 * SEC);

    return () => clearTimeout(toId);
  }, [noti]);

  useEffect(() => {
    console.log(idx, queue);

    // TODO: not working when caching many of the same rune after one another
    if (idx < queue.length) {
      const curr = runes[queue[idx]]!;
      if (curr.mp3.paused) {
        curr.mp3.currentTime = curr.start;
        curr.mp3.play();

        setTimeout(() => {
          setIdx(idx + 1);
        }, curr.length);
      }
    } else if (idx > 0) {
      let validSpell = false;

      for (const { spell, page, sequence, mp3 } of spells) {
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
        fizzle.currentTime = 0;
        fizzle.play();
      }

      setQueue(queue.slice(idx));
      setIdx(0);
    }
  }, [queue, idx]);
}
