import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "..";
import { init } from "../../reducers/shopping-list";
import { hideSpinner, showSpinner } from "../../reducers/spinner";

export default function useInit() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.shoppingList.recipes.length > 0);

  useEffect(() => {
    if (!loaded) {
      dispatch(showSpinner());
      console.debug("fetching recipes");
      dispatch(init()).then(() => dispatch(hideSpinner()));
    }
  }, []);
}
