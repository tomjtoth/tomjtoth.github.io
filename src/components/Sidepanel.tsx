import { Link } from "react-router";

import { ROUTES_CONFIG } from "./AppRoutes/config";
import { useAppDispatch, useAppSelector } from "../hooks";
import { tSP } from "../reducers";

import { QRCode } from ".";

const HASH = import.meta.env.VITE_GIT_HASH ?? 88888888;

export function Sidepanel() {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.sidepanel);
  const url = window.location.toString();

  const linkClass =
    "no-underline p-2 pl-4 select-none cursor-pointer block duration-300 text-fg-0 hover:text-fg-1";

  const navClasses = [
    "z-20 h-full fixed top-0 bg-bg-0 w-[80vw] sm:w-[225px]",
    "flex flex-col items-center",
    "overflow-y-auto border-r duration-300",
    active ? "left-0" : "-left-[calc(80vw+1px)] sm:-left-[226px]",
  ];

  return (
    <>
      {active && (
        <div className="bg-blur" onClick={() => dispatch(tSP.hide())} />
      )}

      <nav
        {...{
          className: navClasses.join(" "),

          onClick: (e) => {
            if (e.target !== e.currentTarget) dispatch(tSP.hide());
          },
        }}
      >
        <ul className="pl-0 mb-0 list-none">
          {ROUTES_CONFIG.filter((x) => x.path != "*").map(
            ({ path: to, label: children, lang }, i) => (
              <li key={i} className="text-center sm:text-left">
                <Link
                  {...{
                    className: linkClass,
                    draggable: false,

                    to,
                    children,
                    lang,
                  }}
                />
              </li>
            )
          )}
        </ul>
        <QRCode
          value={url}
          onClick={() => navigator.clipboard.writeText(url)}
        />
        <span
          className="clickable mb-4"
          onClick={() => navigator.clipboard.writeText(HASH)}
        >
          ver: {HASH}
        </span>
      </nav>
    </>
  );
}
