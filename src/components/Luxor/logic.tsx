import { createContext, useContext, useState } from "react";

import { CxModal } from "../Modal";
import { BugState, CxLuxorType } from "../../types/luxor";
import useInit from "./init";
import {
  addField,
  addNum,
  clearNums,
  rmField,
  rmLastNum,
  update,
} from "../../reducers/luxor";

const BUG_INITIALLY = {
  position: "110vw",
  crawling: false,
  filtered: false,
};

export const CxLuxor = createContext<CxLuxorType | undefined>(undefined);

export default function useLogic() {
  const { dispatch, fields, pickedNums } = useInit();
  const modal = useContext(CxModal)!;

  const [locked, setLocked] = useState(true);
  const [bug, setBug] = useState(BUG_INITIALLY as BugState);

  return {
    locked,
    toggleLocked: () => setLocked(!locked),

    bug,
    moveBug: (position: number | string) =>
      setBug({ position, filtered: false, crawling: true }),
    hideBug: () => setBug({ ...bug, filtered: true }),
    resetBug: () => setBug(BUG_INITIALLY),

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
  } as CxLuxorType;
}
