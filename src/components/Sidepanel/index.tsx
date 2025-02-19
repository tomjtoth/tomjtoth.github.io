import { Link } from "react-router";

import { ROUTES_CONFIG } from "../AppRoutes/config";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { hideSidepanel } from "../../reducers/sidepanel";

import "./sidepanel.css";

import QRCode from "./QRCode";

export default function Sidepanel() {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.sidepanel);
  const className = `border1-e${active ? " active" : ""}`;
  const url = window.location.toString();

  return (
    <nav
      {...{
        id: "sidepanel",
        className,

        onMouseLeave: (e) => {
          // triggers only when leaving *the* panel, not its children
          if (e.target === e.currentTarget) dispatch(hideSidepanel());
        },
        onClick: (e) => {
          if (e.target !== e.currentTarget) dispatch(hideSidepanel());
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
          ({ path, label, lang }, i) => (
            <li key={i}>
              <Link
                className="nav-link clickable"
                {...{
                  to: path,
                  children: label,
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
