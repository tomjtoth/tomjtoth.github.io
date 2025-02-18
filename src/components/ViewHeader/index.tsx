import { HTMLAttributes, PropsWithChildren } from "react";

import useSidepanel from "../../hooks/sidepanel";

import "./view-header.css";

type HeaderProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  title?: string;
};

export default function ViewHeader({
  title,
  children,
  className = "",
  ...props
}: HeaderProps) {
  if (title) document.title = title;

  const { show } = useSidepanel();

  return (
    <div
      {...{
        ...props,
        id: "view-header",
        className: `border1-s ${className}`,
      }}
    >
      <span id="menu-button" className="clickable padded" onClick={show}>
        &#x2630;
      </span>
      {children}
    </div>
  );
}
