import { useAppDispatch, useAppSelector } from ".";
import { setSidepanel } from "../reducers/sidepanel";

export default function useSidepanel() {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.sidepanel);

  return {
    active,

    show: () => dispatch(setSidepanel(true)),

    // just enough delay to not disappear instantly while views change
    hide: () => setTimeout(() => dispatch(setSidepanel(false))),
  };
}
