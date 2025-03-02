import { useAppSelector } from "../../hooks";

export default function Controls() {
  const score = useAppSelector((s) => s.arxFatalis.score);
  const loaded = useAppSelector((s) => s.arxFatalis.loaded);

  return (
    <>
      <span>
        💎{" "}
        <sub className={`text-xs ${loaded ? "visible" : "invisible"}`}>
          {score}
        </sub>
      </span>
      <input
        type="text"
        placeholder="TODO: filter spells from book"
        className="grow"
        disabled
      />
      <a
        className="no-underline px-4"
        href="https://wiki.arx-libertatis.org/Spells"
        target="_blank"
      >
        📖
      </a>
      {/* TODO: <span onClick={() => resetScore()}>reset</span> */}
    </>
  );
}
