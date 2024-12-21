import { Routes, Route, useMatch, useNavigate } from "react-router";
import NavBar from "./components/NavBar";
import About from "./components/About";
import Lyrics from "./components/Lyrics";

export default function () {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/battery-monitor" element={<About />} /> */}
        <Route path="/lyrics" element={<Lyrics />} />
      </Routes>
    </>
  );
}
