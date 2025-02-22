import { Link } from "react-router";

import { Language } from "../../types/modal";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleActiveSL } from "../../reducers/shopping-list";

import Steps from "./Steps";

const id = "slr";

export default function Recipes() {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((s) => s.shoppingList.recipes);
  const active = useAppSelector((s) => s.shoppingList.active);

  return (
    <ul
      {...{
        id,
        className: active.includes(id) ? "active" : undefined,
      }}
    >
      {recipes.map(
        (
          { title, steps, url, opts: { lang: { title: dish_lang } = {} } = {} },
          recipeIdx
        ) => {
          const recId = `slr-${recipeIdx}`;

          return (
            <li
              key={recipeIdx}
              lang={dish_lang}
              className={`clickable p-4 alternating recipe${
                active.includes(recId) ? " active" : ""
              }`}
              onClick={(e) => {
                if (e.target === e.currentTarget)
                  dispatch(toggleActiveSL(recId));
              }}
            >
              {title}

              {url && (
                <Link to={url} target="_blank" className="sli">
                  🔗
                </Link>
              )}
              <Steps
                {...{
                  lang: dish_lang ? Language.Fi : undefined,
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
