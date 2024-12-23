import Songs from "./Songs";
import Logo from "./logos";

export default function ({ keyA, albums, artist, active }) {
  const albums_arr = Object.entries(albums).toSorted(
    ([title_a, a], [title_b, b]) => {
      // move the mix album to the beginning
      if (title_a === "null") return -1;
      if (title_b === "null") return 1;

      // order by year DESC
      if (a.year === undefined) return 1;
      if (b.year === undefined) return -1;
      const year_diff = b.year - a.year;

      if (year_diff === 0) {
        const lower_a = title_a.toLowerCase();
        const lower_b = title_b.toLowerCase();

        // order alphabetically within the same year
        if (lower_a < lower_b) return -1;
        if (lower_a > lower_b) return 1;
      }

      return year_diff;
    }
  );

  return (
    <ul>
      {albums_arr.map(([title, { year, url, ...songs }], i) => {
        const keyAA = `${keyA}-album-${i}`;

        return (
          <li
            key={keyAA}
            {...{
              className:
                albums_arr.length === 1 || active.includes(keyAA)
                  ? "active"
                  : undefined,
              keyAAS: keyAA,
            }}
          >
            <p>
              {year && `${year} - `}
              {title === "null" ? "mix" : title}
              <Logo {...{ url }} />
            </p>
            <Songs {...{ keyAA, songs, artist, active }} />
          </li>
        );
      })}
    </ul>
  );
}
