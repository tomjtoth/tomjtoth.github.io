import { createContext } from "react";

import useInit from "./init";
import {
  addItem,
  resetActiveItems,
  rmItem,
  toggleActive,
} from "../../reducers/shopping-list";
import { TCxShopping } from "../../types/shopping-list";

export const CxShopping = createContext<TCxShopping | undefined>(undefined);

export default function useShoppingList() {
  const { loaded, dispatch, modal, active, items, recipes } = useInit();

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
  } as TCxShopping;
}
