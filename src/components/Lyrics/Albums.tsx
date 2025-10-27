import type { AlbumsProps } from "../../types/lyrics";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { tLyr } from "../../reducers";

import Songs from "./Songs";
import Logo from "./Logos";

export default function Albums({
  artistIdx,
  albums,
  parentHashes,
}: AlbumsProps) {
  const active = useAppSelector((s) => s.lyrics.active);
  const dispatch = useAppDispatch();

  return (
    <ul>
      {albums.map(({ title, year, url, songs, hash }, albumIdx) => {
        const hashes = parentHashes.concat(hash);

        const id = hashes.join("-");

        const clickable = albums.length > 1;

        return (
          <li
            key={hash}
            {...{
              className: `${
                clickable ? "clickable " : "non-clickable "
              }p-4 border rounded${
                albums.length === 1 || active.includes(id) ? " active" : ""
              }`,
              onClick: (e) => {
                if (clickable && e.target === e.currentTarget)
                  dispatch(tLyr.toggle(id));
              },
            }}
          >
            {year && `${year} - `}
            {title === "null" ? "mix" : title}
            <Logo {...{ url }} />
            <Songs {...{ artistIdx, albumIdx, songs, parentHashes: hashes }} />
          </li>
        );
      })}
    </ul>
  );
}
