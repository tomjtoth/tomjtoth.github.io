import { HTMLAttributes, PropsWithChildren } from "react";

type MainViewProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export default function MainView({ children, ...props }: MainViewProps) {
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
