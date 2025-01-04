import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  initRecipes,
  toggleActive,
  rmItem,
} from "../../reducers/shopping-list";

import "./shopping-list.css";

import Modal from "../Modal";
import Header from "../Header";
import MainView from "../MainView";
import Recipes from "./Recipes";
import Items from "./Items";
import ControlForm from "./ControlForm";
import Loader from "../Loader";

export default function () {
  const [modal, setModal] = useState({});
  const dispatch = useDispatch();
  const { recipes, active, items } = useSelector((s) => s.shoppingList);
  const uninitialized = recipes === undefined;

  useEffect(() => {
    if (uninitialized) dispatch(initRecipes());
  }, []);

  return (
    <>
      <Modal {...{ modal, setModal }} />
      <Header title="ostoslista" icon="🛒">
        <ControlForm {...{ active, setModal }} />
      </Header>

      <MainView
        {...{
          onClick: ({ target: { parentNode, id, tagName, classList } }) => {
            if (tagName === "SPAN" && classList.contains("recipe-item-del")) {
              setModal({
                prompt: "poistetaanko varmasti?",
                onSuccess: () => dispatch(rmItem(parentNode.id)),
              });
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
          <Loader />
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
