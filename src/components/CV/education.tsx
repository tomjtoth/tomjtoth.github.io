import useCV from "../../hooks/cv";

export default function Education() {
  const { cv } = useCV();

  return (
    <>
      <h2>
        <b>Education</b>
      </h2>
      <ul>
        {cv?.education.map((e, i) => (
          <li key={i}>
            {e.from} - {e.to}:
            <p>
              {e.name}
              {e.institution} ({e.location}) Responsibilities:
            </p>
            <ul>
              {e.details?.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
