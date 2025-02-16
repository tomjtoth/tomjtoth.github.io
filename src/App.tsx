import useBatMonDaemon from "./hooks/battery-monitor/daemon";

import Modal from "./components/Modal";
import Spinner from "./components/Spinner";
import Sidepanel from "./components/Sidepanel";
import AppRoutes from "./components/Routes";

export default function App() {
  useBatMonDaemon();

  return (
    <Modal>
      <Spinner />
      <Sidepanel />
      <AppRoutes />
    </Modal>
  );
}
