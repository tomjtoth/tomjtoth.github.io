import { useAppSelector } from "../../hooks";
import { re } from "./config";
import { Item, Recipe } from "../../types/shopping-list";

export default function Items() {
  const { recipes, active, items } = useAppSelector((s) => s.shoppingList);

  const ul_items = [...(items as Item[])];

  active.forEach((key) => {
    const match = key.match(re.recipeId);
    if (match) {
      const recId = Number(match.groups!.recId);
      const recipe = recipes[recId] as Recipe;

      ul_items.push(
        ...recipe.items.map((item, i) => ({
          key: `${key}-${i}`,
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
          .map(({ item, key }) => ({
            idx: re.order.findIndex((regex) => regex.test(item)),
            key,
            item,
          }))
          .toSorted((a, b) => a.idx - b.idx)
          .map(({ idx, key, item }) => {
            const isActive = active.includes(key);

            return (
              <li
                key={key}
                id={key}
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
                {!key.startsWith("rec") && (
                  <span className="recipe-item-del clickable">(🚫 poista)</span>
                )}
              </li>
            );
          })}
      </ul>
    </>
  );
}
