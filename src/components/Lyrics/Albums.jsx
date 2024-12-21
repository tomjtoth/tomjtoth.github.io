import Songs from "./Songs";
import Logo from "./logos";

export default function ({ keyA, albums }) {
  return (
    <ul>
      {Object.entries(albums)
        .toSorted(([title_a, a], [title_b, b]) => {
          // move the mix album to the beginning
          if (title_a === null) return -1;
          if (title_b === null) return 1;

          // order by year ASC
          if (a.year === undefined) return -1;
          if (b.year === undefined) return 1;
          const year_diff = a.year - b.year;

          if (year_diff === 0) {
            const lower_a = title_a.toLowerCase();
            const lower_b = title_b.toLowerCase();

            if (lower_a < lower_b) return -1;
            if (lower_a > lower_b) return 1;
          }

          return year_diff;
        })
        .map(([title, { year, url, ...songs }], i) => {
          const keyAA = `${keyA}-album-${i}`;

          return (
            <li key={keyAA}>
              {year} - {title}
              <Logo {...{ url }} />
              <Songs {...{ keyAA, songs }} />
            </li>
          );
        })}
    </ul>
  );
}
