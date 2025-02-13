import useInit from "./init";
import { UseLyrics } from "../../types/lyrics";
import { toggleActive } from "../../reducers/lyrics";

export default function useLyrics() {
  const { dispatch, artists, active } = useInit();

  return {
    artists,

    isActive: (id) => active.includes(id),
    toggleActive: (id) => dispatch(toggleActive(id)),
  } as UseLyrics;
}
