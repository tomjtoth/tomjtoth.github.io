import { HTMLAttributes, PropsWithChildren } from "react";

import { useAppDispatch } from "../hooks";
import { tSP } from "../reducers";
import { MediaControls } from "./Playback";

type HeaderProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  title?: string;
  mediaControlsFirst?: boolean;
};

export function ViewHeader({
  title,
  children,
  className = "",
  mediaControlsFirst = false,
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
        onClick={() => dispatch(tSP.show())}
      >
        &#x2630;
      </span>
      {mediaControlsFirst && <MediaControls />}
      {children}
      {!mediaControlsFirst && <MediaControls />}
    </div>
  );
}
