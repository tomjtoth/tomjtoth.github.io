import { useAppDispatch, useAppSelector } from ".";
import { fadeOut, reset, show } from "../reducers/spinner";

export default function useSpinner() {
  const dispatch = useAppDispatch();
  const { active, className } = useAppSelector((s) => s.spinner);

  return {
    active,
    className,

    show: () => dispatch(show()),

    // hiding with a delay
    hide: () => {
      if (active) dispatch(fadeOut());
    },

    reset: () => dispatch(reset()),
  };
}
