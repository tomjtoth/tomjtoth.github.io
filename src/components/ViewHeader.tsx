import { HTMLAttributes, PropsWithChildren } from "react";

import { useAppDispatch } from "../hooks";
import { showSidepanel } from "../reducers/sidepanel";

type HeaderProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  title?: string;
};

export function ViewHeader({
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
        className: `border-b flex items-center gap-2 ${className}`,
      }}
    >
      <span
        className="clickable p-4 text-[25px] w-[25px]"
        onClick={() => dispatch(showSidepanel())}
      >
        &#x2630;
      </span>
      {children}
    </div>
  );
}
