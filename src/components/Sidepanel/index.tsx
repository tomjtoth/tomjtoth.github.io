import { createContext, PropsWithChildren, useState } from "react";

import "./sidepanel.css";

import Nav from "./Nav";

export const CxSidepanel = createContext({
  show: () => {},
  hide: () => {},
  active: false,
});

export default function Sidepanel({ children }: PropsWithChildren) {
  const [active, setActive] = useState(false);

  function show() {
    setActive(true);
  }

  // just enough delay to not disappear instantly while views change
  function hide() {
    setTimeout(() => setActive(false));
  }

  return (
    <CxSidepanel.Provider value={{ active, show, hide }}>
      <Nav />
      {children}
    </CxSidepanel.Provider>
  );
}
