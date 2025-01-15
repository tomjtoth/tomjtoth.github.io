import { useAppSelector } from "../../hooks";
import { re } from "./config";
import { Recipe } from "../../types/shopping-list";

export default function Items() {
  const { recipes, active, items } = useAppSelector((s) => s.shoppingList);

  const ul_items = items.map(({ id, item }) => ({ id: id.toString(), item }));

  active.forEach((key) => {
    const match = key.match(re.recipeId);
    if (match) {
      const recId = Number(match.groups!.recId);
      const recipe = recipes[recId] as Recipe;

      ul_items.push(
        ...recipe.items.map((item, i) => ({
          id: `${key}-${i}`,
          item: `${item} (${recipe.title})`,
        }))
      );
    }
  });

  return (
    <>
      <h2 className="recipe-items">tavarat korissasi</h2>
      <ul id="recipe-items">
        {ul_items
          // find out which regex matches the item, store it's index, too
          .map(({ item, id }) => ({
            idx: re.order.findIndex((regex) => regex.test(item)),
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
                className={`clickable padded alternating recipe-item${
                  isActive ? " active" : ""
                }`}
              >
                {item}
                {idx === -1 && (
                  <span className="unknown-item" title="tuntematon tavara">
                    ❓
                  </span>
                )}
                {!id.toString().startsWith("rec") && (
                  <span className="recipe-item-del clickable">(🚫 poista)</span>
                )}
              </li>
            );
          })}
      </ul>
    </>
  );
}
