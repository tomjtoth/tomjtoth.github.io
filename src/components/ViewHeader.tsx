import { HTMLAttributes, PropsWithChildren } from "react";

import { useAppDispatch } from "../hooks";
import { sp } from "../reducers";

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
        className="clickable p-4 text-2xl w-[25px]"
        onClick={() => dispatch(sp.show())}
      >
        &#x2630;
      </span>
      {children}
    </div>
  );
}
