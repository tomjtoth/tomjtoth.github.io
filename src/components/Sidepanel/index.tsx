import { Link } from "react-router";

import useSidepanel from "../../hooks/sidepanel";
import { ROUTES_CONFIG } from "../Routes/config";

import "./sidepanel.css";

import QRCode from "./QRCode";

export default function Sidepanel() {
  const { active, hide } = useSidepanel();
  const className = `border1-e${active ? " active" : ""}`;
  const url = window.location.toString();

  return (
    <nav
      {...{
        id: "sidepanel",
        className,

        onMouseLeave: (e) => {
          // triggers only when leaving *the* panel, not its children
          if (e.target === e.currentTarget) hide();
        },
        onClick: (e) => {
          if (e.target !== e.currentTarget) hide();
        },
      }}
    >
      <ul>
        <li>
          <span className="nav-link clickable" style={{ float: "right" }}>
            &times;
          </span>
        </li>
        {ROUTES_CONFIG.filter((x) => x.path != "*").map(
          ({ path, title, lang }, i) => (
            <li key={i}>
              <Link
                className="nav-link clickable"
                {...{
                  to: path,
                  children: title,
                  lang,
                }}
                draggable={false}
              />
            </li>
          )
        )}
      </ul>
      <QRCode value={url} onClick={() => navigator.clipboard.writeText(url)} />
    </nav>
  );
}
