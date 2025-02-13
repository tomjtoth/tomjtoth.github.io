import { UseLyrics } from "../../types/lyrics";
import { toggleActive } from "../../reducers/lyrics";
import { useAppDispatch, useAppSelector } from "..";

export default function useLyrics() {
  const dispatch = useAppDispatch();
  const { artists, active } = useAppSelector((s) => s.lyrics);

  return {
    artists,

    isActive: (id) => active.includes(id),
    toggleActive: (id) => dispatch(toggleActive(id)),
  } as UseLyrics;
}
