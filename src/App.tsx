import useBatMonDaemon from "./hooks/battery-monitor/daemon";

import Modal from "./components/Modal";
import Spinner from "./components/Spinner";
import Sidepanel from "./components/Sidepanel";
import AppRoutes from "./components/AppRoutes";
import AppRoot from "./components/AppRoot";

export default function App() {
  useBatMonDaemon();

  return (
    <Modal>
      <AppRoot>
        <Spinner />
        <Sidepanel />
        <AppRoutes />
      </AppRoot>
    </Modal>
  );
}
