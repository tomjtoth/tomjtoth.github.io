import { createContext, PropsWithChildren, useState } from "react";

import "./sidepanel.css";

import Nav from "./Nav";

type CxSidepanelType =
  | undefined
  | {
      show: () => void;
      hide: (delayed?: boolean) => void;
      active: boolean;
    };

export const CxSidepanel = createContext<CxSidepanelType>(undefined);

export default function Sidepanel({ children }: PropsWithChildren) {
  const [active, setActive] = useState(false);

  function show() {
    setActive(true);
  }

  function hide() {
    setTimeout(() => {
      setActive(false);
    });
  }

  return (
    <CxSidepanel.Provider value={{ active, show, hide }}>
      <Nav />
      {children}
    </CxSidepanel.Provider>
  );
}
