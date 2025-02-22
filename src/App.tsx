import { useBatMonDaemon } from "./hooks";

import { Modal, Spinner, Sidepanel, AppRoutes, ViewRoot } from "./components";

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
