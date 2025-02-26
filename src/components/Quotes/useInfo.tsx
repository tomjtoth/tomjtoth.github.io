import { useAppDispatch } from "../../hooks";
import { qts } from "../../reducers";
import { pad } from "../../utils";

export default function useInfo() {
  const dispatch = useAppDispatch();
  const wpm = 238;

  return (wordCount: number, id: string) => {
    const MM = wordCount / wpm;
    const SS = MM * 60;
    const estimate = `${Math.round(MM)}:${pad(Math.round(SS))}`;

    return (
      <span
        className="border rounded p-1 clickable ml-2"
        onClick={(ev) => {
          if (id != "0" && ev.target === ev.currentTarget)
            dispatch(qts.toggle(id));
        }}
      >
        <span className="hidden sm:contents">{wordCount} sanaa </span>
        <span className="hidden md:contents">@ {wpm}wpm ~ </span>
        {estimate}
      </span>
    );
  };
}
