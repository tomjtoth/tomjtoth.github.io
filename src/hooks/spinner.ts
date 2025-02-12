import { createContext, useState } from "react";

import { TCxSpinner } from "../types/spinner";

export const CxSpinner = createContext<TCxSpinner | undefined>(undefined);

export default function useSpinner() {
  const [active, setActive] = useState(false);
  const [className, setClassName] = useState<string | undefined>(undefined);

  return {
    active,
    className,

    show: () => {
      console.debug("showing spinner");
      setActive(true);
    },

    // hiding with a delay
    hide: () => {
      if (active) {
        console.debug("hiding spinner");
        setClassName("fade-out");
      }
    },

    reset: () => {
      setActive(false);
      setClassName(undefined);
    },
  } as TCxSpinner;
}
