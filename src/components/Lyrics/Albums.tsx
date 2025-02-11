import { useContext } from "react";

import type { AlbumsProps } from "../../types/lyrics";
import { CxLyrics } from "../../hooks/lyrics";

import Songs from "./Songs";
import Logo from "./Logos";

export default function Albums({ artistIdx, albums }: AlbumsProps) {
  const { isActive, toggleActive } = useContext(CxLyrics)!;

  return (
    <ul>
      {albums.map(({ title, year, url, songs }, albumIdx) => {
        const id = [artistIdx, albumIdx].join("-");

        const clickable = albums.length > 1;

        return (
          <li
            key={albumIdx}
            {...{
              className: `${
                clickable ? "clickable " : "non-clickable "
              }padded bordered${
                albums.length === 1 || isActive(id) ? " active" : ""
              }`,
              onClick: (e) => {
                if (clickable && e.target === e.currentTarget) toggleActive(id);
              },
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
