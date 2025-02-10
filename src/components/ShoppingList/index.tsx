import useLogic, { CxShopping } from "./logic";

import "./shopping-list.css";

import Header from "../Header";
import MainView from "../MainView";
import Recipes from "./Recipes";
import Items from "./Items";
import Controls from "./Controls";

export default function ShoppingList() {
  const logic = useLogic();

  return (
    <CxShopping.Provider value={logic}>
      <Header title="ostoslista" icon="🛒">
        <Controls />
      </Header>

      <MainView>
        {logic!.loaded && (
          <>
            <Recipes />
            <Items />
          </>
        )}
      </MainView>
    </CxShopping.Provider>
  );
}
