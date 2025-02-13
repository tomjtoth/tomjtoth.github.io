import { useContext, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "..";
import { CxModal } from "../modal";
import useSpinner from "../spinner";
import { init } from "../../reducers/shopping-list";

export default function useInit() {
  const spinner = useSpinner();
  const modal = useContext(CxModal)!;
  const dispatch = useAppDispatch();

  const rs = useAppSelector((s) => s.shoppingList);
  const loaded = rs.recipes.length > 0;

  useEffect(() => {
    if (!loaded) {
      console.debug("initializing recipes, showing spinner");
      dispatch(init());
      spinner.show();
    } else {
      console.debug("recipes loaded, hiding spinner");
      spinner.hide();
    }
  }, [loaded]);

  return { loaded, dispatch, modal, ...rs };
}
