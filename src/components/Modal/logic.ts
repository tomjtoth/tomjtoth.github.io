import { useEffect } from "react";

import useBuilder from "./builder";

const SOUND = new Audio("/modal.mp3");

export default function useLogic() {
  const res = useBuilder();

  const {
    modal: { prompt, silent, removeAfter },
    reset,
  } = res;

  if (prompt && silent === false) {
    console.debug("playing modal sound");
    SOUND.currentTime = 0;
    SOUND.play();
  }

  useEffect(() => {
    if (removeAfter !== undefined) {
      const id = setTimeout(reset, removeAfter);

      return () => clearTimeout(id);
    }
  }, [removeAfter]);

  return res;
}
