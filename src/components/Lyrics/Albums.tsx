import { useAppSelector } from "../../hooks";
import type { AlbumsProps } from "../../types/lyrics";

import Songs from "./Songs";
import Logo from "./Logos";
import { Active } from "../../types/common";

export default function Albums({ artistIdx, albums }: AlbumsProps) {
  const { active } = useAppSelector((s) => s.lyrics);

  return (
    <ul>
      {albums.map(({ title, year, url, songs }, albumIdx) => {
        const id = [artistIdx, albumIdx].join("-");

        return (
          <li
            key={albumIdx}
            {...{
              id,
              className: `${
                albums.length > 1 ? "clickable " : "non-clickable "
              }padded bordered${
                albums.length === 1 || (active as Active).includes(id)
                  ? " active"
                  : ""
              }`,
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
