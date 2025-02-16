import useVisitors from "../../hooks/visitors";

import "./visitors.css";

import Header from "../Header";

export default function Visitors() {
  const node = useVisitors();

  return (
    <Header lang="hu" title="látogatók">
      {node}
    </Header>
  );
}
