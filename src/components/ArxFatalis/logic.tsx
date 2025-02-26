import { useState, useEffect } from "react";

import { arx, spin } from "../../reducers";
import { Rune, Spell } from "../../types/arx-fatalis";
import { useAppDispatch, useAppSelector, useModal } from "../../hooks";

import Img from "./Img";

export default function useLogic() {
  const castSpells = useAppSelector((s) => s.arxFatalis.castSpells);
  const loaded = useAppSelector((s) => s.arxFatalis.loaded);
  const modal = useModal();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loaded) {
      dispatch(spin.show());
      dispatch(arx.init()).then(() => dispatch(spin.hide()));
    }
  }, []);

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
          const count = castSpells.filter((sp) => sp === idx).length + 1;

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

                  <div className="m-4 flex gap-4 justify-center">
                    {queue.map((rune, idx) => (
                      <Img key={idx} {...{ rune }} />
                    ))}
                  </div>
                </>
              );
          }

          dispatch(arx.cast(idx));
        });
      }

      setQueue([]);
      setIdx(-1);
    }
  }, [idx]);

  return (rune: Rune) => setQueue(() => [...queue, rune]);
}
