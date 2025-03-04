import { useAppDispatch, useAppSelector } from "../../hooks";
import { tSpin } from "../../reducers";

export function Spinner() {
  const { visible, fading } = useAppSelector((s) => s.spinner);
  const dispatch = useAppDispatch();

  return !visible ? null : (
    <div
      className={`bg-blur${fading ? " animate-bg-deblur" : ""}`}
      onAnimationEnd={(ev) => {
        console.debug("animation", ev.animationName, "ended");
        if (ev.animationName === "bg-deblur") {
          dispatch(tSpin.reset());
        }
      }}
    >
      <div
        className={`fixed z-20 left-1/2 top-1/2 -translate-1/2${
          fading ? " animate-spinner-zooming" : ""
        }`}
      >
        <div className="animate-spin border-bg-0 rounded-[50%] border-t-bg-alt-b border-16 w-[50vmin] h-[50vmin]" />
      </div>
    </div>
  );
}
