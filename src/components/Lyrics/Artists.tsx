import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleSelection } from "../../reducers/lyrics";
import { Active } from "../../types/common";
import { Artist } from "../../types/lyrics";

import Albums from "./Albums";
import Logo from "./Logos";

export default function Artists() {
  const dispatch = useAppDispatch();
  const { artists, active } = useAppSelector((s) => s.lyrics);

  return (
    <ul lang="sv" id="lyrics">
      {(artists as Artist[]).map(({ name, url, albums }, artistIdx) => {
        const id = [artistIdx].join();

        return (
          <li
            key={artistIdx}
            {...{
              className: `clickable padded bordered${
                (active as Active).includes(id) ? " active" : ""
              }`,
              onClick: (e) => {
                if (e.target === e.currentTarget) dispatch(toggleSelection(id));
              },
            }}
          >
            {name}
            <Logo {...{ url }} />
            <Albums {...{ artistIdx, albums }} />
          </li>
        );
      })}
    </ul>
  );
}
