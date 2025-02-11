import { createContext, useContext } from "react";

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
  const modal = useContext(CxModal)!;

  const loaded = recipes.length > 0;
  useInit(loaded);

  return {
    loaded,
    recipes,

    items,
    addItem: (name) => dispatch(addItem(name)),
    rmItem: (id, name) =>
      modal
        .yes(() => dispatch(rmItem(id)))
        .no()
        .prompt(`poistetaanko ${name} varmasti?`),

    active,
    toggleActive: (id) => dispatch(toggleActive(id)),
    resetActive: () =>
      modal
        .yes(() => dispatch(resetActiveItems()))
        .no()
        .prompt("pyyhitäänkö kaikki vihreät?"),
  } as CxShoppingType;
}
