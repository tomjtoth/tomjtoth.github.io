import { useAppSelector } from "../../hooks";
import type { AlbumsProps } from "./types";
import { idxOf } from "../../utils";

import Songs from "./Songs";
import Logo from "./Logos";

export default function Albums({ artistIdx, albums }: AlbumsProps) {
  const { active } = useAppSelector((s) => s.lyrics);

  return (
    <ul>
      {albums.map(({ title, year, url, songs }, albumIdx) => {
        const id = `lyrics-${artistIdx}-${albumIdx}`;

        return (
          <li
            key={id}
            {...{
              className: `${
                albums.length > 1 ? "clickable " : "non-clickable "
              }padded bordered${
                albums.length === 1 || idxOf(active, [artistIdx, albumIdx]) > -1
                  ? " active"
                  : ""
              }`,
              id,
            }}
          >
            {year && `${year} - `}
            {title === "null" ? "mix" : title}
            <Logo {...{ url }} />
            <Songs {...{ artistIdx, albumIdx, songs }} />
          </li>
        );
      })}
    </ul>
  );
}
