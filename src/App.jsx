import { Routes, Route, useMatch, useNavigate } from "react-router";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import BatteryMonitor from "./components/BatteryMonitor";
import Lyrics from "./components/Lyrics";
import ShoppingList from "./components/ShoppingList";

export default function () {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/battery-monitor" element={<BatteryMonitor />} />
        <Route path="/lyrics" element={<Lyrics />} />
      </Routes>
    </>
  );
}
