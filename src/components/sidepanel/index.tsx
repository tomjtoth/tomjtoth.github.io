import { Link, useLocation } from "react-router";

import "./sidepanel.css";

import QRCode from "../QRCode";
import Nav from "./Nav";

const links = [
  { children: "alkuun", to: "/" },
  { children: "látogatók", to: "/visitors", lang: "hu" },
  { children: "Luxor sorsolás", to: "/luxor", lang: "hu" },
  { children: "akunvalvonta", to: "/battery-monitor" },
  { children: "ostoslista", to: "/shopping-list" },
  { children: "låttext", to: "/lyrics", lang: "sv" },
  {
    children: "Arx Fatails minipeli",
    to: "/arx-fatalis",
  },
];

export default function Sidepanel() {
  const { pathname } = useLocation();

  return (
    <Nav>
      <ul
        style={{
          listStyle: "none",
          paddingLeft: 8,
        }}
      >
        <li>
          <span
            className="toggler nav-link clickable"
            style={{ float: "right" }}
          >
            &times;
          </span>
        </li>
        {links.map((lnk, i) => (
          <Link key={`nav-link-${i}`} className="nav-link" {...lnk} />
        ))}
      </ul>
      <QRCode value={`${window.location.pathname}/#${pathname}`} />
    </Nav>
  );
}
