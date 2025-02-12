import { createContext, useState } from "react";

import { BugState, TCxLuxor } from "../../types/luxor";
import useInit from "./init";
import {
  addField,
  addNum,
  clearNums,
  rmField,
  rmLastNum,
  update,
} from "../../reducers/luxor";

const DEFAULT = {
  position: "110vw",
  filtered: false,
};

export const CxLuxor = createContext<TCxLuxor | undefined>(undefined);

export default function useLuxor() {
  const { dispatch, modal, fields, pickedNums } = useInit();
  const [locked, setLocked] = useState(true);
  const [bug, setBug] = useState(DEFAULT as BugState);

  return {
    modal,
    locked,
    toggleLocked: () => setLocked(!locked),

    bug,
    moveBug: (position, fast) =>
      setBug({ position, filtered: false, transition: fast ? "1s" : "2s" }),
    hideBug: () => setBug({ ...bug, filtered: true }),
    resetBug: () => setBug(DEFAULT),

    pickedNums,
    addNum: (num) => dispatch(addNum(num)),
    update: (arr) => dispatch(update(arr)),
    rmLastNum: () => dispatch(rmLastNum()),
    clearNums: () =>
      modal
        .hu()
        .ok(() => dispatch(clearNums()))
        .cancel()
        .prompt(
          <>
            Törlöm az <strong>összes</strong> húzott számot
          </>
        ),

    fields,
    addField: (id) => dispatch(addField(id)),
    rmField: (id) => dispatch(rmField(id)),
  } as TCxLuxor;
}
