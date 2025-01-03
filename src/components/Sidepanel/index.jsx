import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

import "./sidepanel.css";

import { setSidepanel } from "../../reducers/sidepanel";

import QRCode from "../QRCode";

export default function () {
  const dispatch = useDispatch();
  const className = useSelector((s) => s.sidepanel.active)
    ? "active"
    : undefined;

  const links = [
    { children: "alkuun", to: "/" },
    { children: "látogatók", to: "/visitors", lang: "hu" },
    // { children: "Luxor sorsolás", to: "/luxor", lang: "hu" },
    { children: "akunvalvonta", to: "/battery-monitor" },
    { children: "ostoslista", to: "/shopping-list" },
    { children: "låttext", to: "/lyrics", lang: "sv" },
    {
      children: "Arx Fatails minipeli",
      to: "/runes",
    },
  ];

  const { pathname } = useLocation();

  return (
    <nav
      {...{
        id: "sidepanel",
        className,

        onMouseLeave: (e) => {
          if (e.target.tagName === "NAV") {
            dispatch(setSidepanel(false));
          }
        },

        onClick: ({ target }) => {
          if (target.classList.contains("toggler")) {
            dispatch(setSidepanel(false));
          } else if (target.closest("#qr-code")) {
            navigator.clipboard.writeText(window.location);
          }
        },
      }}
    >
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
      <QRCode value={`https://ttj.hu/#${pathname}`} />
    </nav>
  );
}
