import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { spin, sl } from "../../reducers";

import { ViewHeader, ViewContent } from "..";
import Recipes from "./Recipes";
import Items from "./Items";
import Controls from "./Controls";

export function ShoppingList() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.shoppingList.recipes.length > 0);

  useEffect(() => {
    if (!loaded) {
      dispatch(spin.show());
      console.debug("fetching recipes");
      dispatch(sl.init()).then(() => dispatch(spin.hide()));
    }
  }, []);

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
