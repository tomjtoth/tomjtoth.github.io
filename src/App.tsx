import { Routes, Route, Navigate } from "react-router";

import useBatteryMonitor from "./hooks/battery-monitor";

import Sidepanel from "./components/Sidepanel";
import Home from "./components/Home";
import BatteryMonitor from "./components/BatteryMonitor";
import Lyrics from "./components/Lyrics";
import ShoppingList from "./components/ShoppingList";
import ArxFatalis from "./components/ArxFatalis";
import Visitors from "./components/Visitors";
import Luxor from "./components/Luxor";

export default function App() {
  useBatteryMonitor();

  return (
    <>
      <Sidepanel />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/luxor" element={<Luxor />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/battery-monitor" element={<BatteryMonitor />} />
        <Route path="/lyrics" element={<Lyrics />} />
        <Route path="/arx-fatalis" element={<ArxFatalis />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
