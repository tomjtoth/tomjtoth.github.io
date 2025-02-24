import { Link } from "react-router";

import { ROUTES_CONFIG } from "./AppRoutes/config";
import { useAppDispatch, useAppSelector } from "../hooks";
import { hideSidepanel } from "../reducers/sidepanel";

import { QRCode } from ".";

export function Sidepanel() {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.sidepanel);
  const url = window.location.toString();

  const linkClass =
    "no-underline p-2 pl-4 select-none cursor-pointer block duration-300 text-fg-0 hover:text-fg-1";

  return (
    <nav
      {...{
        className: `z-1 h-full fixed w-[225px] top-0 pr-[25px] border-r duration-300 bg-bg-0 ${
          active ? "left-0" : "-left-[251px]"
        }`,

        onMouseLeave: (e) => {
          // triggers only when leaving *the* panel, not its children
          if (e.target === e.currentTarget) dispatch(hideSidepanel());
        },

        onClick: (e) => {
          if (e.target !== e.currentTarget) dispatch(hideSidepanel());
        },
      }}
    >
      <ul className="my-4 ml-4 pl-0 list-none">
        <li>
          <span className={`${linkClass} float-right`}>&times;</span>
        </li>
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
      <QRCode value={url} onClick={() => navigator.clipboard.writeText(url)} />
    </nav>
  );
}
