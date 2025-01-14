import { useAppDispatch, useAppSelector } from "../../hooks";
import { setSidepanel } from "../../reducers/sidepanel";
import { NavProps } from "./types";

export default function Nav({ children }: NavProps) {
  const dispatch = useAppDispatch();
  const className = `border1-e ${
    useAppSelector((s) => s.sidepanel.active) ? " active" : ""
  }`;
  return (
    <nav
      {...{
        id: "sidepanel",
        className,

        onMouseLeave: (e) => {
          if ((e.target as HTMLElement).tagName === "NAV") {
            dispatch(setSidepanel(false));
          }
        },

        onClick: ({ target }) => {
          const t = target as HTMLElement;
          if (t.classList.contains("toggler")) {
            dispatch(setSidepanel(false));
          } else if (t.closest("#qr-code")) {
            navigator.clipboard.writeText(window.location.toString());
          }
        },
      }}
    >
      {children}
    </nav>
  );
}
