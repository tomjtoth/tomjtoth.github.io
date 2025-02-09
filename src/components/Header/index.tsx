import { ReactNode, HTMLAttributes } from "react";

import { useAppDispatch } from "../../hooks";
import { setSidepanel } from "../../reducers/sidepanel";

import "./header.css";

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
}: HeaderProps) {
  document.title = title;

  const dispatch = useAppDispatch();

  return (
    <div
      {...{
        ...props,
        id: "header",
        className: "border1-s",
      }}
    >
      <span
        id="menu-button"
        className="clickable padded"
        onClick={() => dispatch(setSidepanel(true))}
      >
        &#x2630;
      </span>
      {children}
    </div>
  );
}
