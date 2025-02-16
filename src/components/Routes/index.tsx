import { Route, Routes } from "react-router";
import { ROUTES_CONFIG } from "./config";

export default function AppRoutes() {
  return (
    <Routes>
      {ROUTES_CONFIG.map((r, i) => (
        <Route key={i} {...r} />
      ))}
    </Routes>
  );
}
