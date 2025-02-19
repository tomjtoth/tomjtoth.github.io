import { useContext } from "react";
import { CxModal } from "../components/Modal/logic";

export default function useModal() {
  return useContext(CxModal)!;
}
