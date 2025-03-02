import { useAppSelector, useSpeech } from "../../hooks";
import { ListProps } from "../../types/quotes";

import Info from "./Info";

export function List({ items, parentId }: ListProps) {
  const active = useAppSelector((s) => s.quotes.active);
  const ss = useSpeech();

  return (
    <ul
      className={`list-none ${
        !parentId || active.includes(parentId) ? "" : "hidden"
      } ${!parentId ? "pl-0" : "pl-0"}`}
    >
      {items.map((item, i) => {
        const id = parentId ? `${parentId}-${i}` : i.toString();

        return (
          <li
            key={i}
            className={`p-2 px-0.5 sm:p-4 sm:px-1.5 mt-2 ${
              parentId ? "border rounded" : ""
            }`}
          >
            {"quote" in item ? (
              <>
                <div className="flex *:content-center">
                  <Info wordCount={item.words} id={id} />
                  {ss && (
                    <span
                      className="mx-2 clickable p-1 border rounded"
                      onClick={() => ss.speak(item.quote)}
                    >
                      🤖
                    </span>
                  )}
                  {item.punchline && <b>{item.punchline}</b>}
                </div>

                <p
                  className={`whitespace-pre-line px-1 ${
                    active.includes(id) ? "" : "hidden"
                  }`}
                >
                  {item.quote}
                </p>
              </>
            ) : (
              <>
                {item.name}
                <Info wordCount={item.words} id={id} />

                <List {...{ items: item.items, parentId: id }} />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
