import { Link } from "react-router";
import Steps from "./Steps";

const id = "recipes";

export default function Recipes({ active, recipes }) {
  return (
    <ul
      {...{
        id,
        className: active.includes(id) ? "active" : undefined,
      }}
    >
      {recipes.map(
        (
          [
            title,
            { steps, url, opts: { lang: { title: dish_lang } = {} } = {} },
          ],
          i
        ) => {
          const rKey = `recipe-${i}`;
          const isActive = active.includes(rKey);

          return (
            <li
              key={rKey}
              id={rKey}
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
              <Steps {...{ lang: dish_lang ? "fi" : undefined, rKey, steps }} />
            </li>
          );
        }
      )}
    </ul>
  );
}
