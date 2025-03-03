import { useAppDispatch, useAppSelector } from "../../hooks";
import { qts, ss as ssr } from "../../reducers";
import { ListProps } from "../../types/quotes";

import Info from "./Info";

export function List({ items, indices: parentIndices }: ListProps) {
  const active = useAppSelector((s) => s.quotes.active);
  const ss = useAppSelector((s) => s.speechSynth);
  const dispatch = useAppDispatch();

  return (
    <ul
      className={`list-none pl-0 ${
        parentIndices.length === 0 || active.includes(parentIndices.join("-"))
          ? ""
          : "hidden"
      }`}
    >
      {items.map((item, i) => {
        const indices = [...parentIndices, i];
        const strId = indices.join("-");

        return (
          <li
            key={i}
            className={`p-2 px-0.5 sm:p-4 sm:px-1.5 mt-2 ${
              parentIndices.length > 0 ? "border rounded" : ""
            }`}
          >
            {"quote" in item ? (
              <>
                <div className="flex *:content-center">
                  <Info wordCount={item.words} id={strId} />
                  {item.audio && (
                    <span
                      className="ml-2 clickable p-1 border rounded"
                      title="äänikirjasta pätkä"
                      onClick={() => dispatch(qts.play(indices))}
                    >
                      🗣️
                    </span>
                  )}
                  {ss && (
                    <span
                      className="ml-2 clickable p-1 border rounded"
                      title="lue ääneen"
                      onClick={() => dispatch(ssr.speak(item.quote))}
                    >
                      🤖
                    </span>
                  )}
                  {item.punchline && <b className="ml-2">{item.punchline}</b>}
                </div>

                <p
                  className={`whitespace-pre-line px-1 ${
                    active.includes(strId) ? "" : "hidden"
                  }`}
                >
                  {item.quote}
                </p>
              </>
            ) : (
              <>
                {item.name}
                <Info wordCount={item.words} id={strId} />

                <List {...{ items: item.items, indices }} />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
