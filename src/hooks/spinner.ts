import { createContext, useState } from "react";

import { TCxSpinner } from "../types/spinner";

export const CxSpinner = createContext<TCxSpinner | undefined>(undefined);

export default function useSpinner() {
  const [active, setActive] = useState(false);

  return {
    active,

    show: () => {
      console.debug("showing spinner");
      setActive(true);
    },

    // hiding with a delay
    hide: () => {
      if (active) {
        console.debug("hiding spinner");
        setTimeout(() => setActive(false), 250);
      }
    },
  } as TCxSpinner;
}
