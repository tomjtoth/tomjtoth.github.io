import { ReactNode, HTMLAttributes } from "react";
import { useAppDispatch } from "../../hooks";

import "./header.css";

import { setSidepanel } from "../../reducers/sidepanel";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: string;
  children?: ReactNode;
}

export default function Header({
  title,
  icon,
  children,
  ...props
}: HeaderProps): JSX.Element {
  document.title = title;

  const dispatch = useAppDispatch();

  return (
    <div
      {...{
        ...props,
        id: "header",
        className: "border1-s",

        onClick: ({ target }) => {
          if ((target as HTMLElement).classList.contains("toggler")) {
            dispatch(setSidepanel(true));
          }
        },
      }}
    >
      <span id="menu-button" className="toggler clickable padded">
        &#x2630;
      </span>
      {children}
    </div>
  );
}
