import { useState, useEffect, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { castSpell, init } from "../../reducers/arx-fatalis";
import { Rune } from "../../types/arx-fatalis/runes";
import { CxModal } from "../Modal";
import { CxSpinner } from "../Spinner";
import { Spell } from "../../types/arx-fatalis/spells";
import { LogicProps } from "../../types/arx-fatalis";

import Img from "./Img";

export default function useLogic({ queue, setQueue }: LogicProps) {
  const dispatch = useAppDispatch();
  const arx = useAppSelector((s) => s.arxFatalis);

  const spinner = useContext(CxSpinner)!;
  const modal = useContext(CxModal)!;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!arx) {
      dispatch(init());
      spinner.show();
    } else {
      spinner.hide();
    }
  }, [arx]);

  useEffect(() => {
    console.debug(idx, queue);

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
          arx!.castSpells.filter((spell) => spell === idx).length + 1;

        if (count < 3 || count % 10 == 0) {
          console.debug(`cast ${idx}, ${count} times => showing modal`);
          modal
            .en()
            .silent()
            .removeAfter(3000)
            .prompt(
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
            );
        }

        dispatch(castSpell(idx));
      });
      setQueue(queue.slice(idx));
      setIdx(0);
    }
  }, [queue, idx]);
}
