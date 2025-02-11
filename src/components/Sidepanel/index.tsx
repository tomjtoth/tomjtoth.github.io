import { createContext, PropsWithChildren } from "react";

import useLogic from "./logic";
import { TCxSidepanel } from "../../types/sidepanel";

import "./sidepanel.css";

import Nav from "./Nav";

export const CxSidepanel = createContext<TCxSidepanel | undefined>(undefined);

export default function Sidepanel({ children }: PropsWithChildren) {
  const logic = useLogic();

  return (
    <CxSidepanel.Provider value={logic}>
      <Nav />
      {children}
    </CxSidepanel.Provider>
  );
}
