import { useContext } from "react";

import { useAppDispatch, useAppSelector } from "..";
import { UseShoppingList } from "../../types/shopping-list";
import { CxModal } from "../modal";
import {
  addItem,
  resetActiveItems,
  rmItem,
  toggleActive,
} from "../../reducers/shopping-list";

export default function useShoppingList() {
  const dispatch = useAppDispatch();
  const rs = useAppSelector((s) => s.shoppingList);
  const modal = useContext(CxModal)!;

  return {
    loaded: rs.recipes.length > 0,
    ...rs,

    addItem: (name) => dispatch(addItem(name)),
    rmItem: (id, name) =>
      modal
        .yes(() => dispatch(rmItem(id)))
        .no()
        .prompt(`poistetaanko ${name} varmasti?`),

    toggleActive: (id) => dispatch(toggleActive(id)),
    resetActive: () =>
      modal
        .yes(() => dispatch(resetActiveItems()))
        .no()
        .prompt("pyyhitäänkö kaikki vihreät?"),
  } as UseShoppingList;
}
