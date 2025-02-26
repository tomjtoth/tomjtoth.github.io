import { useAppSelector } from "../../hooks";
import { ListProps } from "../../types/quotes";
import useInfo from "./useInfo";

export function List({ items, parentId }: ListProps) {
  const active = useAppSelector((s) => s.quotes.active);
  const info = useInfo();
  const ulClass =
    !parentId || active.includes(parentId) || parentId === "0" ? "" : "hidden";

  return (
    <ul className={`list-none ${ulClass} ${!parentId ? "pl-0" : "pl-1"}`}>
      {items.map((item, i) => {
        const id = parentId ? `${parentId}-${i}` : i.toString();

        return (
          <li key={i} className="border rounded p-2 px-0.5 mt-2">
            {"quote" in item ? (
              <>
                {info(item.words, id)}

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
