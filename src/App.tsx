import useBatMonDaemon from "./hooks/battery-monitor-daemon";

import Modal from "./components/Modal";
import Spinner from "./components/Spinner";
import Sidepanel from "./components/Sidepanel";
import AppRoutes from "./components/AppRoutes";
import ViewRoot from "./components/ViewRoot";

export default function App() {
  useBatMonDaemon();

  return (
    <Modal>
      <ViewRoot>
        <Spinner />
        <Sidepanel />
        <AppRoutes />
      </ViewRoot>
    </Modal>
  );
}
