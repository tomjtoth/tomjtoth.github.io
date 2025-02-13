import useInit from "./init";
import {
  addItem,
  resetActiveItems,
  rmItem,
  toggleActive,
} from "../../reducers/shopping-list";
import { UseShoppingList } from "../../types/shopping-list";

export default function useShoppingList() {
  const { dispatch, modal, loaded, ...rs } = useInit();

  return {
    loaded,
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
