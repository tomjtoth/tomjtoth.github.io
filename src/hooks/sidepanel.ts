import { useState, createContext } from "react";

import { TCxSidepanel } from "../types/sidepanel";

export const CxSidepanel = createContext<TCxSidepanel | undefined>(undefined);

export default function useSidepanel() {
  const [active, setActive] = useState(false);

  return {
    active,

    show: () => setActive(true),

    // just enough delay to not disappear instantly while views change
    hide: () => setTimeout(() => setActive(false)),
  } as TCxSidepanel;
}
