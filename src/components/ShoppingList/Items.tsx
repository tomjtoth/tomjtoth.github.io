import useShoppingList from "../../hooks/shopping-list";
import { order } from "./config";

export default function Items() {
  const { recipes, active, items, toggleActive, rmItem } = useShoppingList();

  const ul_items = items.map(({ id, name }) => ({
    id: `sli-${id}`,
    name,
  }));

  active.forEach((id) => {
    const [prefix, recId, ...rest] = id.split("-");

    if (rest.length === 0 && recId !== undefined && prefix === "slr") {
      const recipe = recipes[Number(recId)];

      ul_items.push(
        ...recipe.items.map((item, i) => ({
          id: `${id}-${i}`,
          name: `${item} (${recipe.title})`,
        }))
      );
    }
  });

  return (
    <>
      <h2 className="sli">
        {ul_items.length > 0
          ? "tavarat listallasi"
          : "listasi on tyhjä, lisää kamaa!"}
      </h2>

      <ul id="sli">
        {ul_items
          // find out which regex matches the item, store it's index, too
          .map(({ name, id }) => ({
            idx: order.findIndex((regex) => regex.test(name)),
            id,
            name,
          }))
          .toSorted((a, b) => a.idx - b.idx)
          .map(({ idx, id, name }) => {
            const isActive = active.includes(id.toString());

            return (
              <li
                key={id}
                id={id.toString()}
                className={`clickable padded alternating sli${
                  isActive ? " active" : ""
                }`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) toggleActive(id);
                }}
              >
                {name}

                {idx === -1 && (
                  <span className="unknown-item" title="tuntematon tavara">
                    ❓
                  </span>
                )}

                {!id.toString().startsWith("slr") && (
                  <span
                    className="sli-del clickable"
                    onClick={() => rmItem(id, name)}
                  >
                    (🚫 poista)
                  </span>
                )}
              </li>
            );
          })}
      </ul>
    </>
  );
}
