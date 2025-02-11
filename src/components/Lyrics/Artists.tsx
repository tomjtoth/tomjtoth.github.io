import { useContext } from "react";

import { CxLyrics } from "../../hooks/lyrics";

import Albums from "./Albums";
import Logo from "./Logos";

export default function Artists() {
  const { artists, isActive, toggleActive } = useContext(CxLyrics)!;

  return (
    <ul lang="sv" id="lyrics">
      {artists.map(({ name, url, albums }, artistIdx) => {
        const id = [artistIdx].join();

        return (
          <li
            key={artistIdx}
            {...{
              className: `clickable padded bordered${
                isActive(id) ? " active" : ""
              }`,
              onClick: (e) => {
                if (e.target === e.currentTarget) toggleActive(id);
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
