import { State } from "../../types/arx-fatalis";

export default function Controls({ arx }: { arx: State }) {
  return (
    <>
      <span>
        💎 <sub style={{ fontSize: "x-small" }}>{arx.score}</sub>
      </span>
      <input type="text" placeholder="TODO: filter spells from book" disabled />
      <a
        className="spells"
        href="https://wiki.arx-libertatis.org/Spells"
        target="_blank"
      >
        📖
      </a>
      {/* TODO: <span onClick={() => resetScore()}>reset</span> */}
    </>
  );
}
