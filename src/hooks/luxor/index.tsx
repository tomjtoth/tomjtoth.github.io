import { UseLuxor } from "../../types/luxor";
import useInit from "./init";
import {
  addField,
  addNum,
  clearNums,
  hideBug,
  moveBug,
  resetBug,
  rmField,
  rmLastNum,
  toggleLocked,
  update,
} from "../../reducers/luxor";

export default function useLuxor() {
  const { dispatch, modal, ...rs } = useInit();

  return {
    ...rs,
    modal,

    toggleLocked: () => dispatch(toggleLocked()),

    moveBug: (position, fast) => dispatch(moveBug(position, fast)),
    hideBug: () => dispatch(hideBug()),
    resetBug: () => dispatch(resetBug()),

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

    addField: (id) => dispatch(addField(id)),
    rmField: (id) => dispatch(rmField(id)),
  } as UseLuxor;
}
