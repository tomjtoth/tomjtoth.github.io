import { PropsWithChildren } from "react";

import useSidepanel, { CxSidepanel } from "../../hooks/sidepanel";

import "./sidepanel.css";

import Nav from "./Nav";

export default function Sidepanel({ children }: PropsWithChildren) {
  const logic = useSidepanel();

  return (
    <CxSidepanel.Provider value={logic}>
      <Nav />
      {children}
    </CxSidepanel.Provider>
  );
}
