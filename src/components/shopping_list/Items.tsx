import { useAppSelector } from "../../hooks";
import { order } from "./config";
import { Recipe } from "../../types/shopping-list";

const RE_RECIPE_ID = /^slr-(?<recId>\d+)$/;

export default function Items() {
  const { recipes, active, items } = useAppSelector((s) => s.shoppingList);

  const ul_items = items.map(({ id, item }) => ({ id: `sli-${id}`, item }));

  active.forEach((id) => {
    const match = id.match(RE_RECIPE_ID);
    if (match) {
      const recId = Number(match.groups!.recId);
      const recipe = recipes[recId] as Recipe;

      ul_items.push(
        ...recipe.items.map((item, i) => ({
          id: `${id}-${i}`,
          item: `${item} (${recipe.title})`,
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
          .map(({ item, id }) => ({
            idx: order.findIndex((regex) => regex.test(item)),
            id,
            item,
          }))
          .toSorted((a, b) => a.idx - b.idx)
          .map(({ idx, id, item }) => {
            const isActive = active.includes(id.toString());

            return (
              <li
                key={id}
                id={id.toString()}
                className={`clickable padded alternating sli${
                  isActive ? " active" : ""
                }`}
              >
                {item}
                {idx === -1 && (
                  <span className="unknown-item" title="tuntematon tavara">
                    ❓
                  </span>
                )}
                {!id.toString().startsWith("slr") && (
                  <span className="sli-del clickable">(🚫 poista)</span>
                )}
              </li>
            );
          })}
      </ul>
    </>
  );
}
