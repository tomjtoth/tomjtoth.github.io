import { ReactNode, HTMLAttributes, useContext } from "react";

import { CxSidepanel } from "../Sidepanel";

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

  const { show } = useContext(CxSidepanel)!;

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
        onClick={() => show()}
      >
        &#x2630;
      </span>
      {children}
    </div>
  );
}
