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
          i
        ) => {
          const recId = `recipe-${i}`;
          const isActive = active.includes(recId);

          return (
            <li
              key={recId}
              id={recId}
              lang={dish_lang}
              className={`clickable padded alternating recipe${
                isActive ? " active" : ""
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
