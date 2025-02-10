import { createContext, useState } from "react";

import { BugState, CxLuxorType } from "../../types/luxor";
import useInit from "./init";

const BUG_INITIALLY = {
  position: "110vw",
  crawling: false,
  filtered: false,
};

export const CxLuxor = createContext<CxLuxorType | undefined>(undefined);

export default function useLogic() {
  useInit();

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
  };
}
