import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  initRecipes,
  toggleActive,
  rmItem,
} from "../../reducers/shopping-list";

import MainView from "../MainView";
import Header from "../Header";
import Recipes from "./Recipes";
import Items from "./Items";
import ControlForm from "./ControlForm";
import "./shopping-list.css";

export default function () {
  const dispatch = useDispatch();
  const { recipes, active, items } = useSelector((s) => s.shoppingList);
  const uninitialized = recipes === undefined;

  useEffect(() => {
    if (uninitialized) dispatch(initRecipes());
  }, []);

  return (
    <>
      <Header title="ostoslista" icon="🛒">
        <ControlForm {...{ active }} />
      </Header>

      <MainView
        {...{
          onClick: ({ target: { parentNode, id, tagName, classList } }) => {
            if (tagName === "SPAN" && classList.contains("recipe-item-del")) {
              // TODO: implement modal confirm
              dispatch(rmItem(parentNode.id));
            } else if (
              tagName === "LI" &&
              (classList.contains("recipe") ||
                classList.contains("recipe-item"))
            ) {
              dispatch(toggleActive(id));
            }
          },
        }}
      >
        {uninitialized ? (
          <p>hetki pieni...</p>
        ) : (
          <>
            <Recipes {...{ active, recipes }} />
            <Items {...{ active, recipes, items }} />
          </>
        )}
      </MainView>
    </>
  );
}
