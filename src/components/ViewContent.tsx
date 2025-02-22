import { HTMLAttributes, PropsWithChildren } from "react";

export function ViewContent({
  children,
  className = "",
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      {...{
        ...props,
        className: `flex-grow overflow-y-scroll ${className}`,
      }}
    >
      {children}
    </div>
  );
}
