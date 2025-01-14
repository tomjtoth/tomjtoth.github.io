import { Link, useLocation } from "react-router";
import { links } from "./config";

import "./sidepanel.css";

import QRCode from "../QRCode";
import Nav from "./Nav";

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
