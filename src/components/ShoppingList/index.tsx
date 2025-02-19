import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { hideSpinner, showSpinner } from "../../reducers/spinner";
import { initSL } from "../../reducers/shopping-list";

import "./shopping-list.css";

import ViewHeader from "../ViewHeader";
import ViewContent from "../ViewContent";
import Recipes from "./Recipes";
import Items from "./Items";
import Controls from "./Controls";

export default function ShoppingList() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.shoppingList.recipes.length > 0);

  useEffect(() => {
    if (!loaded) {
      dispatch(showSpinner());
      console.debug("fetching recipes");
      dispatch(initSL()).then(() => dispatch(hideSpinner()));
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
