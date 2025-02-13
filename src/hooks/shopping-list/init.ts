import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "..";
import useModal from "../modal";
import useSpinner from "../spinner";
import { init } from "../../reducers/shopping-list";

export default function useInit() {
  const spinner = useSpinner();
  const { modal } = useModal();

  const dispatch = useAppDispatch();
  const { active, items, recipes } = useAppSelector((s) => s.shoppingList);
  const loaded = recipes.length > 0;

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

  return { loaded, dispatch, modal, active, items, recipes };
}
