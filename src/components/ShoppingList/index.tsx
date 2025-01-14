import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  initRecipes,
  toggleActiveId,
  rmItem,
} from "../../reducers/shopping-list";
import { ModalType as ModalType } from "../../types/modal";

import "./shopping-list.css";

import Modal from "../Modal";
import Header from "../Header";
import MainView from "../MainView";
import Recipes from "./Recipes";
import Items from "./Items";
import ControlForm from "./ControlForm";
import Loader from "../Loader";

export default function ShoppingList() {
  const [modal, setModal] = useState<ModalType>();
  const dispatch = useAppDispatch();
  const { recipes, active } = useAppSelector((s) => s.shoppingList);
  const uninitialized = recipes.length === 0;

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
          onClick: ({ target }) => {
            const { parentNode, id, tagName, classList } =
              target as HTMLElement;

            if (tagName === "SPAN" && classList.contains("recipe-item-del")) {
              setModal({
                prompt: "poistetaanko varmasti?",
                onSuccess: () =>
                  dispatch(rmItem((parentNode as HTMLElement)!.id)),
              });
            } else if (
              tagName === "LI" &&
              (classList.contains("recipe") ||
                classList.contains("recipe-item"))
            ) {
              dispatch(toggleActiveId(id));
            }
          },
        }}
      >
        {uninitialized ? (
          <Loader />
        ) : (
          <>
            <Recipes />
            <Items />
          </>
        )}
      </MainView>
    </>
  );
}
