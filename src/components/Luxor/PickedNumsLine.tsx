import { useAppDispatch, useAppSelector } from "../../hooks";
import { last } from "../../utils";
import {
  undo,
  bugCrawlsTo,
  bugRemovePrivacy,
  bugResets,
} from "../../reducers/luxor";
import { PickedNumsLineProps } from "../../types/luxor";

export default function PickedNumsLine({ setModal }: PickedNumsLineProps) {
  const dispatch = useAppDispatch();
  const { pickedNums, bug } = useAppSelector((s) => s.luxor);

  return (
    <div
      id="luxor-picked-nums-line"
      onAnimationEnd={(ev) => {
        if (ev.animationName === "luxor-bug-privacy-filter") {
          dispatch(bugCrawlsTo("-10vw"));
          dispatch(bugRemovePrivacy());
        }

        setTimeout(() => {
          dispatch(bugResets());
        }, 710);
      }}
    >
      <span>
        {pickedNums.length === 0 && <>&nbsp;</>}
        {pickedNums.length > 10 && "..."}
        {(last(pickedNums, 10) as number[]).join(", ")}
      </span>

      {bug.privacy && (
        <div id="luxor-num-bug-priv-filter" style={{ left: bug.x }} />
      )}

      {pickedNums.length > 0 && (
        <span
          className="clickable"
          onClick={(e) =>
            setModal({
              prompt: (
                <>
                  Törlöm az <strong>utolsó</strong> húzott számot
                </>
              ),
              lang: "hu",
              onSuccess: () => {
                dispatch(
                  bugCrawlsTo(
                    (
                      (e.target as HTMLElement).previousSibling as HTMLElement
                    ).getBoundingClientRect().right - 8
                  )
                );

                setTimeout(() => {
                  dispatch(undo());
                }, 710);
              },
            })
          }
        >
          ⬅️
        </span>
      )}
      <div
        id="luxor-num-bug"
        className={bug.className}
        style={bug.x ? { left: bug.x } : undefined}
      >
        🪲
      </div>
    </div>
  );
}
