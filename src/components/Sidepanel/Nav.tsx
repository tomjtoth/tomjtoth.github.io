import { useContext } from "react";
import { Link } from "react-router";

import { CxSidepanel } from "../../hooks/sidepanel";
import { links } from "./config";

import QRCode from "./QRCode";

export default function Nav() {
  const { active, hide } = useContext(CxSidepanel)!;
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
        {links.map((lnk, i) => (
          <li key={i}>
            <Link className="nav-link clickable" {...lnk} draggable={false} />
          </li>
        ))}
      </ul>
      <QRCode value={url} onClick={() => navigator.clipboard.writeText(url)} />
    </nav>
  );
}
