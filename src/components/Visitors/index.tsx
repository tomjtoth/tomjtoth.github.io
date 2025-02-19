import useVisitors from "./logic";

import "./visitors.css";

import ViewHeader from "../ViewHeader";

export default function Visitors() {
  const node = useVisitors();

  return (
    <ViewHeader lang="hu" title="látogatók">
      {node}
    </ViewHeader>
  );
}
