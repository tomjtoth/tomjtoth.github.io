import useShoppingList from "../../hooks/shopping-list";

import "./shopping-list.css";

import ViewHeader from "../ViewHeader";
import ViewContent from "../ViewContent";
import Recipes from "./Recipes";
import Items from "./Items";
import Controls from "./Controls";
import useInit from "../../hooks/shopping-list/init";

export default function ShoppingList() {
  useInit();
  const { loaded } = useShoppingList();

  return (
    <>
      <ViewHeader title="ostoslista">
        <Controls />
      </ViewHeader>

      <ViewContent>
        {loaded && (
          <>
            <Recipes />
            <Items />
          </>
        )}
      </ViewContent>
    </>
  );
}
