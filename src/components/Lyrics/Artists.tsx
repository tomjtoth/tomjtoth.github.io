import { useAppDispatch, useAppSelector } from "../../hooks";
import { lyricsToggle } from "../../reducers/lyrics";

import Albums from "./Albums";
import Logo from "./Logos";

export default function Artists() {
  const dispatch = useAppDispatch();
  const artists = useAppSelector((s) => s.lyrics.artists);
  const active = useAppSelector((s) => s.lyrics.active);

  return (
    <ul lang="sv" id="lyrics">
      {artists.map(({ name, url, albums }, artistIdx) => {
        const id = [artistIdx].join();

        return (
          <li
            key={artistIdx}
            {...{
              className: `clickable p-4 border rounded${
                active.includes(id) ? " active" : ""
              }`,
              onClick: (e) => {
                if (e.target === e.currentTarget) dispatch(lyricsToggle(id));
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
