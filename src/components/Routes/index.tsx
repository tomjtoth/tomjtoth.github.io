import { Route, Routes } from "react-router";
import { ROUTES_CONFIG } from "./config";

export default function AppRoutes() {
  return (
    <Routes>
      {ROUTES_CONFIG.map(({ path, element }, i) => (
        <Route key={i} {...{ path, element }} />
      ))}
    </Routes>
  );
}
