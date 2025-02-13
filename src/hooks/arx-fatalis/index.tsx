import { useState, useEffect } from "react";

import useInit from "./init";
import { castSpell } from "../../reducers/arx-fatalis";
import { Rune } from "../../types/arx-fatalis/runes";
import { Spell } from "../../types/arx-fatalis/spells";

import Img from "../../components/ArxFatalis/Img";

export default function useArxFatalis() {
  const { arx, modal, dispatch } = useInit();

  const [queue, setQueue] = useState<Rune[]>([]);
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (idx === -1 && queue.length > 0) {
      console.debug("triggering 1st playback");
      setIdx(0);
    }
  }, [queue]);

  useEffect(() => {
    if (-1 < idx && idx < queue.length) {
      const curr = queue[idx];
      let delay = curr.play();

      setTimeout(() => {
        setIdx(idx + 1);
      }, delay);
    } else {
      if (queue.length > 0) {
        Spell.tryCast(queue, (spell: Spell) => {
          const { idx, page, name } = spell;
          const count = arx!.castSpells.filter((sp) => sp === idx).length + 1;

          if (count < 3 || count % 10 == 0) {
            console.debug(`cast ${idx}, ${count} times => showing modal`);
            modal
              .en()
              .silent()
              .removeAfter(3000)
              .prompt(
                <>
                  {count % 10 === 0
                    ? `Congrats! This is your ${count}th time casting ${name}`
                    : `You cast ${name} from page ${page}:`}

                  <div style={{ margin: 16 }}>
                    {queue.map((rune, idx) => (
                      <Img key={idx} {...{ rune }} />
                    ))}
                  </div>
                </>
              );
          }

          dispatch(castSpell(idx));
        });
      }

      setQueue([]);
      setIdx(-1);
    }
  }, [idx]);

  return {
    arx,
    runes: Rune.arr,
    push: (rune: Rune) => setQueue(() => [...queue, rune]),
  };
}
