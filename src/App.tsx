import { useBatMonDaemon } from "./hooks";
import { Spinner, Sidepanel, AppRoutes, ViewRoot } from "./components";

export default function App() {
  useBatMonDaemon();

  return (
    <ViewRoot>
      <Spinner />
      <Sidepanel />
      <AppRoutes />
    </ViewRoot>
  );
}
