import { useState, useEffect, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Rune } from "../../types/arx-fatalis/runes";
import { castSpell } from "../../reducers/arx-fatalis";
import { CxModal } from "../Modal";
import Img from "./Img";
import { Spell } from "../../types/arx-fatalis/spells";
import { LogicProps } from "../../types/arx-fatalis";

export default function useLogic({ queue, setQueue }: LogicProps) {
  const { setModal } = useContext(CxModal)!;
  const state = useAppSelector((s) => s.arxFatalis)!;

  const dispatch = useAppDispatch();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    console.log(idx, queue);

    // TODO: not working when caching many of the same rune after one another
    if (idx < queue.length) {
      const curr = Rune.byVariant(queue[idx])!;

      if (curr.mp3.paused) {
        let len = curr.play();

        setTimeout(() => {
          setIdx(idx + 1);
        }, len);
      }
    } else if (idx > 0) {
      Spell.tryCast(queue, (idx: number, spell: string, page: number) => {
        const count =
          state.castSpells.filter((spell) => spell === idx).length + 1;
        if (count < 3 || count % 10 == 0) {
          console.debug(`cast ${idx}, ${count} times => showing modal`);
          setModal({
            silent: true,
            removeAfter: 3000,
            prompt: (
              <>
                {count % 10 === 0
                  ? `Congrats! This is your ${count}th time casting ${spell}`
                  : `You cast ${spell} from page ${page}:`}

                <div>
                  {queue.map((re, idx) => (
                    <Img key={idx} {...{ rune: Rune.byVariant(re)! }} />
                  ))}
                </div>
              </>
            ),
          });
        }

        dispatch(castSpell(idx));
      });
      setQueue(queue.slice(idx));
      setIdx(0);
    }
  }, [queue, idx]);
}
