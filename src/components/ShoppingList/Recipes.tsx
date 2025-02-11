import { useContext } from "react";
import { Link } from "react-router";

import { CxShopping } from "../../hooks/shopping-list";
import { Language } from "../../types/modal";

import Steps from "./Steps";

const id = "slr";

export default function Recipes() {
  const { recipes, active, toggleActive } = useContext(CxShopping)!;

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
              className={`clickable padded alternating recipe${
                active.includes(recId) ? " active" : ""
              }`}
              onClick={(e) => {
                if (e.target === e.currentTarget) toggleActive(recId);
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
