import { useRef } from "react";

import { last } from "../../utils";
import { useAppDispatch, useAppSelector, useModal } from "../../hooks";
import { tLux } from "../../reducers";

export default function PickedNumsLine() {
  const pickedNums = useAppSelector((s) => s.luxor.pickedNums);
  const bug = useAppSelector((s) => s.luxor.bug);
  const modal = useModal();
  const dispatch = useAppDispatch();

  const span = useRef<HTMLSpanElement>(null);

  return (
    <div
      id="luxor-picked-nums-line"
      className="flex items-center justify-center gap-2 p-2"
    >
      <span
        className="clickable p-2 mx-2"
        onClick={() =>
          modal
            .hu()
            .ok(() => dispatch(tLux.rick()))
            .cancel()
            .prompt(
              <>
                <h3>
                  Jövő heti számok <sub>(béta-verzió)</sub>
                </h3>
                <p>
                  A Szerencsejáték Zrt. által publikált korábban kihúzott számok
                  és Machine Learning (Mesterséges intelligencia) segítségével
                  most megnézheted a jövő heti számokat.
                </p>
              </>
            )
        }
      >
        🔮
      </span>
      <span ref={span}>
        {pickedNums.length > 10 && "..."}
        {(last(pickedNums, 10) as number[]).join(", ")}
      </span>

      <span
        className={`clickable ml-2 p-2 ${
          pickedNums.length === 0 ? "hidden" : "visible"
        }`}
        onClick={() =>
          modal
            .hu()
            .ok(() =>
              dispatch(
                tLux.bugMove(
                  span.current!.getBoundingClientRect().right - 8,
                  true
                )
              )
            )
            .cancel()
            .prompt(
              <>
                Törlöm az <strong>utolsó</strong> húzott számot
              </>
            )
        }
      >
        ⬅️
      </span>

      <div
        className="fixed z-1 text-4xl select-none animate-luxor-bug"
        style={{ left: bug.position, transition: bug.transition }}
        onTransitionEnd={() => {
          if (bug.position !== "-10vw" && bug.position !== "110vw") {
            dispatch(tLux.bugHide());
            dispatch(tLux.pop());
          } else if (bug.position === "-10vw") {
            dispatch(tLux.bugReset());
          }
        }}
      >
        🪲
      </div>

      {bug.filtered && (
        <div
          className="fixed z-2 w-15 h-15 rounded-full border-2 border-red-500 cursor-not-allowed -translate-x-[50%] animate-luxor-bug-blur"
          style={{ left: bug.position }}
          onAnimationEnd={() => dispatch(tLux.bugMove("-10vw", false))}
        />
      )}
    </div>
  );
}
