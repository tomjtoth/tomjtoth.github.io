import { useSpinner, useAppSelector } from "../../hooks";

import { ViewHeader, ViewContent } from "..";
import Recipes from "./Recipes";
import Items from "./Items";
import Controls from "./Controls";

export function ShoppingList() {
  const loaded = useAppSelector((s) => s.shoppingList.recipes.length > 0);
  useSpinner(loaded);

  return (
    <>
      <ViewHeader title="ostoslista">
        <Controls />
      </ViewHeader>

      <ViewContent>
        {loaded && (
          <>
            <Recipes />
            <Items />
          </>
        )}
      </ViewContent>
    </>
  );
}
