import { HTMLAttributes, PropsWithChildren } from "react";

import { useAppDispatch } from "../hooks";
import { sp } from "../reducers";
import { SpeechControls } from "./Speech";

type HeaderProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  title?: string;
  speechControlsFirst?: boolean;
};

export function ViewHeader({
  title,
  children,
  className = "",
  speechControlsFirst = false,
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
      {speechControlsFirst && <SpeechControls />}
      {children}
      {!speechControlsFirst && <SpeechControls />}
    </div>
  );
}
