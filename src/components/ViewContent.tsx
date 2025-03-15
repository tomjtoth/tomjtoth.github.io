import {
  createContext,
  HTMLAttributes,
  PropsWithChildren,
  RefObject,
  useContext,
} from "react";

export const CxViewContent = createContext<RefObject<HTMLDivElement> | null>(
  null
);

export function ViewContent({
  children,
  className = "",
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const ref = useContext(CxViewContent);

  return (
    <div
      {...{
        ...props,
        ref,
        className: `flex-grow overflow-y-auto ${className}`,
      }}
    >
      {children}
    </div>
  );
}
