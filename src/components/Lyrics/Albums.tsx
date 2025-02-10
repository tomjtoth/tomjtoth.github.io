import { useAppDispatch, useAppSelector } from "../../hooks";
import type { AlbumsProps } from "../../types/lyrics";
import { Active } from "../../types/common";
import { toggleSelection } from "../../reducers/lyrics";

import Songs from "./Songs";
import Logo from "./Logos";

export default function Albums({ artistIdx, albums }: AlbumsProps) {
  const dispatch = useAppDispatch();
  const { active } = useAppSelector((s) => s.lyrics);

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
                albums.length === 1 || (active as Active).includes(id)
                  ? " active"
                  : ""
              }`,
              onClick: (e) => {
                if (clickable && e.target === e.currentTarget)
                  dispatch(toggleSelection(id));
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
