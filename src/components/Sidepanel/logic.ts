import { useState } from "react";

export default function useLogic() {
  const [active, setActive] = useState(false);

  return {
    active,

    show: () => setActive(true),

    // just enough delay to not disappear instantly while views change
    hide: () => setTimeout(() => setActive(false)),
  };
}
