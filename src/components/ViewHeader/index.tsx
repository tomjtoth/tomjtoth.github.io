import { HTMLAttributes, PropsWithChildren } from "react";

import { useAppDispatch } from "../../hooks";
import { showSidepanel } from "../../reducers/sidepanel";

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

  const dispatch = useAppDispatch();

  return (
    <div
      {...{
        ...props,
        id: "view-header",
        className: `border-b ${className}`,
      }}
    >
      <span
        id="menu-button"
        className="clickable p-4"
        onClick={() => dispatch(showSidepanel())}
      >
        &#x2630;
      </span>
      {children}
    </div>
  );
}
