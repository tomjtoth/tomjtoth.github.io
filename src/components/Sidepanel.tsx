import { useRef } from "react";
import { Link } from "react-router";

import { ROUTES_CONFIG } from "./AppRoutes/config";
import { useAppDispatch, useAppSelector } from "../hooks";
import { sp } from "../reducers";

import { QRCode } from ".";
import { IS_TOUCH_DEVICE } from "../utils";
const HASH = import.meta.env.VITE_GIT_HASH;

export function Sidepanel() {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.sidepanel);
  const url = window.location.toString();
  const verRef = useRef<HTMLSpanElement>(null);

  const linkClass =
    "no-underline p-2 pl-4 select-none cursor-pointer block duration-300 text-fg-0 hover:text-fg-1";

  return (
    <>
      {active && (
        <div className="bg-blur" onClick={() => dispatch(sp.hide())} />
      )}

      <nav
        {...{
          className: `z-20 h-full fixed w-[225px] top-0 pr-[25px] border-r duration-300 bg-bg-0 ${
            active ? "left-0" : "-left-[251px]"
          }`,

          onMouseLeave: (e) => {
            // triggers only when leaving *the* panel, not its children
            if (e.target === e.currentTarget) dispatch(sp.hide());
          },

          onClick: (e) => {
            if (
              ![e.currentTarget, verRef.current as Node].includes(
                e.target as Node
              )
            )
              dispatch(sp.hide());
          },
        }}
      >
        <ul className="my-4 ml-4 pl-0 list-none">
          {ROUTES_CONFIG.filter((x) => x.path != "*").map(
            ({ path: to, label: children, lang }, i) => (
              <li key={i}>
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
        <div lang="en" className="ml-[25px] flex gap-4 flex-col items-center">
          {IS_TOUCH_DEVICE && (
            <span
              className="p-4 border rounded"
              onClick={() => location.reload()}
            >
              refresh ♻️
            </span>
          )}
          <span
            ref={verRef}
            className="clickable"
            onClick={() => navigator.clipboard.writeText(HASH)}
          >
            ver: {HASH ?? 88888888}
          </span>
        </div>
      </nav>
    </>
  );
}
