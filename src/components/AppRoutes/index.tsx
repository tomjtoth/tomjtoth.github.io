import { Route, Routes, Navigate } from "react-router";
import { ROUTES_CONFIG } from "./config";

export function AppRoutes() {
  return (
    <Routes>
      {ROUTES_CONFIG.concat({
        path: "*",
        element: <Navigate to="/" />,
      }).map(({ path, element }, i) => (
        <Route key={i} {...{ path, element }} />
      ))}
    </Routes>
  );
}
