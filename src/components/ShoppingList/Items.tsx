import { re } from "./config";

export default function Items({ active, recipes, items }) {
  const ul_items = [...items];

  active.forEach((key) => {
    const match = key.match(re.recipeId);
    if (match) {
      const { recId } = match.groups;
      ul_items.push(
        ...recipes[recId][1].items.map((item, i) => ({
          key: `${key}-item-${i}`,
          item: `${item} (${recipes[recId][0]})`,
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
                {!key.startsWith("recipe-") && (
                  <span className="recipe-item-del clickable">(🚫 poista)</span>
                )}
              </li>
            );
          })}
      </ul>
    </>
  );
}
