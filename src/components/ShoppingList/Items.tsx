import { rmItemSL, toggleActiveSL } from "../../reducers/shopping-list";
import { useAppDispatch, useAppSelector, useModal } from "../../hooks";
import { order } from "./config";

export default function Items() {
  const dispatch = useAppDispatch();
  const modal = useModal();
  const items = useAppSelector((s) => s.shoppingList.items);
  const active = useAppSelector((s) => s.shoppingList.active);
  const recipes = useAppSelector((s) => s.shoppingList.recipes);

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
                className={`clickable p-4 alternating sli${
                  isActive ? " active" : ""
                }`}
                onClick={(e) => {
                  if (e.target === e.currentTarget)
                    dispatch(toggleActiveSL(id));
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
                    onClick={() =>
                      modal
                        .yes(() => dispatch(rmItemSL(id)))
                        .no()
                        .prompt(`poistetaanko "${name}" varmasti?`)
                    }
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
