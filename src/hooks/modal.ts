import { useContext } from "react";
import { CxModal } from "../components/Modal/logic";

export function useModal() {
  return useContext(CxModal)!;
}
