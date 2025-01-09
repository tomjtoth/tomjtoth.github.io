import { ReactNode, HTMLAttributes } from "react";

interface MainViewProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export default function MainView({
  children,
  ...props
}: MainViewProps): JSX.Element {
  return (
    <div
      {...{
        ...props,
        id: "main",
      }}
    >
      {children}
    </div>
  );
}
