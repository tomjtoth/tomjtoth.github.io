import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { createSelector } from "@reduxjs/toolkit";

import { hideSpinner, showSpinner } from "../../reducers/spinner";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { processImports } from "../../services/luxor";
import { initLuxor } from "../../reducers/luxor";
import useModal from "../../hooks/modal";

const selLoaded = createSelector(
  (s) => s.luxor.pickedNums,
  (nums) => nums.length > 0
);

export function useInit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const modal = useModal();
  const { search, pathname } = useLocation();
  const loaded = useAppSelector(selLoaded);

  useEffect(() => {
    if (!loaded) {
      dispatch(showSpinner());

      const imps = new URLSearchParams(search).get("import");
      const [arr, prompt, critical] = processImports(imps);

      if (prompt) {
        modal
          .hu()
          .ok(() => {
            if (!critical) {
              dispatch(initLuxor(arr)).then(() => dispatch(hideSpinner()));
              navigate(pathname);
            }
          })
          .prompt(prompt);
      } else {
        dispatch(initLuxor(arr)).then(() => dispatch(hideSpinner()));
        if (imps) navigate(pathname);
      }
    }
  }, []);
}
