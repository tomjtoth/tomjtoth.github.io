import { useAppDispatch } from ".";
import { fadeOut, reset, show } from "../reducers/spinner";

export default function useSpinner() {
  const dispatch = useAppDispatch();

  return {
    show: () => dispatch(show()),
    hide: () => dispatch(fadeOut()),
    reset: () => dispatch(reset()),
  };
}
