import { createContext } from "react";

import useInit from "./init";
import { TCxLyrics } from "../../types/lyrics";
import { toggleActive } from "../../reducers/lyrics";

export const CxLyrics = createContext<TCxLyrics | undefined>(undefined);

export default function useLogic() {
  const { dispatch, artists, active } = useInit();

  return {
    artists,

    isActive: (id) => active.includes(id),
    toggleActive: (id) => dispatch(toggleActive(id)),
  } as TCxLyrics;
}
