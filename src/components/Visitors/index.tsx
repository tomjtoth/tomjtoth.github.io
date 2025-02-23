import useLogic from "./logic";

import { ViewHeader } from "..";

export function Visitors() {
  const node = useLogic();

  return (
    <ViewHeader lang="hu" title="látogatók">
      {node}
    </ViewHeader>
  );
}
