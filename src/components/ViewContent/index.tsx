import { HTMLAttributes, PropsWithChildren } from "react";

import "./view-content.css";

type MainViewProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export default function ViewContent({ children, ...props }: MainViewProps) {
  return (
    <div
      {...{
        ...props,
        id: "view-content",
      }}
    >
      {children}
    </div>
  );
}
