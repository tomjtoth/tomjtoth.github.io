import { Link } from "react-router";
import { useAppSelector } from "../../hooks";

import Steps from "./Steps";
import { Recipe } from "../../types/shopping-list";

const id = "slr";

export default function Recipes() {
  const { recipes, active } = useAppSelector((s) => s.shoppingList);

  return (
    <ul
      {...{
        id,
        className: active.includes(id) ? "active" : undefined,
      }}
    >
      {(recipes as Recipe[]).map(
        (
          { title, steps, url, opts: { lang: { title: dish_lang } = {} } = {} },
          recipeIdx
        ) => {
          const recId = `slr-${recipeIdx}`;

          return (
            <li
              key={recipeIdx}
              id={recId}
              lang={dish_lang}
              className={`clickable padded alternating recipe${
                active.includes(recId) ? " active" : ""
              }`}
            >
              {title}

              {url && (
                <Link to={url} target="_blank" className="sli">
                  🔗
                </Link>
              )}
              <Steps
                {...{
                  lang: dish_lang ? "fi" : undefined,
                  recId,
                  steps,
                }}
              />
            </li>
          );
        }
      )}
    </ul>
  );
}
