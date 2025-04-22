import {
  createContext,
  HTMLAttributes,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef,
} from "react";

const CxViewContent = createContext<RefObject<HTMLDivElement | null> | null>(
  null
);

/**
 * same as document.getElementById("view-content")
 */
export function useViewContentRef() {
  return useContext(CxViewContent);
}

export function ViewContentRefProvider({ children }: PropsWithChildren) {
  const vcRef = useRef<HTMLDivElement>(null);

  return (
    <CxViewContent.Provider value={vcRef}>{children}</CxViewContent.Provider>
  );
}

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
