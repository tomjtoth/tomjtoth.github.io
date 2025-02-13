import useShoppingList from "../../hooks/shopping-list";

import "./shopping-list.css";

import Header from "../Header";
import MainView from "../MainView";
import Recipes from "./Recipes";
import Items from "./Items";
import Controls from "./Controls";

export default function ShoppingList() {
  const { loaded } = useShoppingList();

  return (
    <>
      <Header title="ostoslista" icon="🛒">
        <Controls />
      </Header>

      <MainView>
        {loaded && (
          <>
            <Recipes />
            <Items />
          </>
        )}
      </MainView>
    </>
  );
}
