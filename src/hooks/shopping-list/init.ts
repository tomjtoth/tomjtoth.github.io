import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "..";
import useSpinner from "../spinner";
import { init } from "../../reducers/shopping-list";

export default function useInit() {
  const spinner = useSpinner();
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.shoppingList.recipes.length > 0);

  useEffect(() => {
    if (!loaded) {
      spinner.show();
      console.debug("fetching recipes");
      dispatch(init()).then(spinner.hide);
    }
  }, []);
}
