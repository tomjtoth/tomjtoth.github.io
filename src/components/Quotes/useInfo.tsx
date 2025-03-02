import { useAppDispatch, useAppSelector } from "../../hooks";
import { qts } from "../../reducers";
import { pad } from "../../utils";

export default function useInfo() {
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.quotes.active);
  const wpm = useAppSelector((s) => s.quotes.wpm);

  return (wordCount: number, id: string) => {
    const MM = wordCount / wpm;
    const SS = (MM % 1) * 60;
    const estimate = `${Math.round(MM)}:${pad(Math.round(SS))}`;

    return (
      <span
        className="border rounded p-1 clickable ml-2 pr-2"
        onClick={() => {
          dispatch(qts.toggle(id));
        }}
      >
        <span className="hidden sm:contents">{wordCount} sanaa </span>
        <span className="hidden md:contents">@ {wpm}wpm ~ </span>
        {estimate}{" "}
        <div
          className={`duration-200 font-bold inline-block ${
            active.includes(id) ? "rotate-90" : "-rotate-90"
          }`}
        >
          &lt;
        </div>
      </span>
    );
  };
}
