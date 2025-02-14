import { RedState } from "../../types/cv";

export default function Experience({ cv }: RedState) {
  return (
    <>
      <h2>
        <b>Experience</b>
      </h2>
      <ul>
        {cv?.experience.map((w, i) => (
          <li key={i}>
            {w.from} - {w.to}:
            <p>
              {w.title}
              {w.hours && <sub>({w.hours})</sub>}
              {w.company} ({w.location}) Responsibilities:
            </p>
            <ul>
              {w.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
