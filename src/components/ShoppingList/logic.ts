import { createContext, useContext } from "react";

import { Text } from "../../types/modal";
import useInit from "./init";
import { CxModal } from "../Modal";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addItem,
  resetActiveItems,
  rmItem,
  toggleActive,
} from "../../reducers/shopping-list";
import { CxShoppingType } from "../../types/shopping-list";

export const CxShopping = createContext<CxShoppingType>(undefined);

export default function useLogic() {
  const dispatch = useAppDispatch();
  const { active, items, recipes } = useAppSelector((s) => s.shoppingList);
  const { setModal } = useContext(CxModal)!;

  const loaded = recipes.length > 0;
  useInit(loaded);

  return {
    loaded,
    recipes,

    items,
    addItem: (name) => dispatch(addItem(name)),
    rmItem: (id, name) =>
      setModal({
        prompt: `poistetaanko ${name} varmasti?`,
        buttons: [[Text.Yes, () => dispatch(rmItem(id))], [Text.No]],
      }),

    active,
    toggleActive: (id) => dispatch(toggleActive(id)),
    resetActive: () =>
      setModal({
        prompt: "pyyhitäänkö kaikki vihreät?",
        buttons: [[Text.Yes, () => dispatch(resetActiveItems())], [Text.No]],
      }),
  } as CxShoppingType;
}
