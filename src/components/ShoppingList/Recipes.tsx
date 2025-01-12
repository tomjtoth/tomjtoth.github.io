import { Link } from "react-router";
import { useAppSelector } from "../../hooks";

import Steps from "./Steps";
import { Recipe } from "./types";

const id = "recipes";

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
          recipeId
        ) => {
          const recId = `rec${recipeId}`;

          return (
            <li
              key={recId}
              id={recId}
              lang={dish_lang}
              className={`clickable padded alternating recipe${
                active.includes(recId) ? " active" : ""
              }`}
            >
              {title}

              {url && (
                <Link to={url} target="_blank" className="recipe-item">
                  🔗
                </Link>
              )}
              <Steps
                {...{ lang: dish_lang ? "fi" : undefined, recId, steps }}
              />
            </li>
          );
        }
      )}
    </ul>
  );
}
