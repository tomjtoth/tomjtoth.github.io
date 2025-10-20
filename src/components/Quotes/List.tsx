import { useAppDispatch, useAppSelector } from "../../hooks";
import { tQt, tSS } from "../../reducers";
import { ListProps } from "../../types/quotes";

import Info from "./Info";

export function List({ items, hashes: parentHashes }: ListProps) {
  const active = useAppSelector((s) => s.quotes.active);
  const ss = useAppSelector((s) => s.speechSynth);
  const dispatch = useAppDispatch();

  return (
    <ul
      className={`list-none pl-0 ${
        parentHashes.length === 0 || active.includes(parentHashes.join("-"))
          ? ""
          : "hidden"
      }`}
    >
      {items.map(({ hash, ...item }) => {
        const hashes = [...parentHashes, hash];
        const strId = hashes.join("-");

        return (
          <li
            key={hash}
            className={`p-2 pr-1 sm:p-4 sm:pr-2 mt-2 ${
              parentHashes.length > 0 ? "border rounded" : ""
            }`}
          >
            {"quote" in item || "innerHTML" in item ? (
              <>
                <div className="flex *:content-center">
                  <Info wordCount={item.words} id={strId} />
                  {item.audio && (
                    <span
                      className="ml-2 clickable p-1 border rounded"
                      title="äänikirjasta pätkä"
                      onClick={() => dispatch(tQt.play(item.audio!.url))}
                    >
                      🗣️
                    </span>
                  )}
                  {ss.isSupported && (
                    <span
                      className="ml-2 clickable p-1 border rounded"
                      title="robotti lukee"
                      onClick={(ev) => {
                        let text;

                        if ("innerHTML" in item) {
                          const span = ev.target as HTMLSpanElement;
                          const div = span.parentNode as HTMLDivElement;
                          const p = div.nextSibling as HTMLParagraphElement;

                          text = p.textContent!;
                        } else {
                          text = item.quote;
                        }

                        dispatch(tSS.speak(text));
                      }}
                    >
                      🤖
                    </span>
                  )}
                  {item.punchline && <b className="ml-2">{item.punchline}</b>}
                </div>

                {"innerHTML" in item ? (
                  <p
                    className={`whitespace-pre-line px-1 ${
                      active.includes(strId) ? "" : "hidden"
                    }`}
                    dangerouslySetInnerHTML={{ __html: item.innerHTML }}
                  />
                ) : (
                  <p
                    className={`whitespace-pre-line px-1 ${
                      active.includes(strId) ? "" : "hidden"
                    }`}
                  >
                    {item.quote}
                  </p>
                )}
              </>
            ) : (
              <>
                {item.name}
                <Info wordCount={item.words} id={strId} />

                <List {...{ items: item.items, hashes }} />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
