import { useContext, useEffect } from "react";

import { useAppDispatch } from "../../hooks";
import { CxSpinner } from "../Spinner";
import { init } from "../../reducers/shopping-list";

export default function useInit(loaded: boolean) {
  const dispatch = useAppDispatch();
  const spinner = useContext(CxSpinner)!;

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
}
