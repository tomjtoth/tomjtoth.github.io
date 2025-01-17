import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { init, toggleActive, rmItem } from "../../reducers/shopping-list";
import { ModalType as ModalType } from "../../types/modal";

import "./shopping-list.css";

import Modal from "../Modal";
import Header from "../Header";
import MainView from "../MainView";
import Recipes from "./Recipes";
import Items from "./Items";
import ControlForm from "./ControlForm";
import Loader from "../Loader";

const RE_SLRI = /^sl[ri]/;

export default function ShoppingList() {
  const [modal, setModal] = useState<ModalType>();
  const dispatch = useAppDispatch();
  const { recipes, active } = useAppSelector((s) => s.shoppingList);
  const uninitialized = recipes.length === 0;

  useEffect(() => {
    if (uninitialized) dispatch(init());
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

            if (tagName === "SPAN" && classList.contains("sli-del")) {
              setModal({
                prompt: "poistetaanko varmasti?",
                onSuccess: () =>
                  dispatch(rmItem((parentNode as HTMLElement)!.id)),
              });
            } else if (tagName === "LI" && RE_SLRI.test(id)) {
              dispatch(toggleActive(id));
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
