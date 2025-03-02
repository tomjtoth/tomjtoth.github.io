import { useAppSelector, useSpeech } from "../../hooks";
import { ListProps } from "../../types/quotes";
import useInfo from "./useInfo";

export function List({ items, parentId }: ListProps) {
  const active = useAppSelector((s) => s.quotes.active);
  const ss = useSpeech();
  const info = useInfo();

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
                {info(item.words, id)}
                {ss && (
                  <span
                    className="ml-2 clickable"
                    onClick={() => ss.speak(item.quote)}
                  >
                    🤖
                  </span>
                )}
                {item.punchline && (
                  <>
                    {" "}
                    <b>{item.punchline}</b>
                  </>
                )}

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
                {info(item.words, id)}

                <List {...{ items: item.items, parentId: id }} />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
