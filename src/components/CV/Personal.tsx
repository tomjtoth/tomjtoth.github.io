import { useAppSelector } from "../../hooks";

export default function Personal() {
  const { cv, img } = useAppSelector((s) => s.cv);

  let details = null;

  if (cv) {
    const p = cv.personal;
    document.title = `CV of ${p.lastname}, ${p.firstname}`;

    details = (
      <div>
        <div style={{ textAlign: "center" }}>
          <b>{p.firstname.toUpperCase()}</b>{" "}
          <span className="cv-lastname">{p.lastname.toUpperCase()}</span>
        </div>
        <ul className="cv-personal-data">
          <li data-icon="📞">
            <a href={`tel:${p.phone}`}>{p.phone}</a>
          </li>

          <li data-icon="✉️">
            <a href={`mailto:${p.email}`}>{p.email}</a>
          </li>

          {p.website && (
            <li data-icon="🌐">
              <a href={p.website} target="_blank">
                {p.website.replace("https://", "")}
              </a>
            </li>
          )}

          <li data-icon="📍">{p.location}</li>

          {p.citizenship.map(({ flag, nationality }, i) => (
            <li data-icon={flag} key={i}>
              {nationality}
            </li>
          ))}

          <li data-icon="🎂">{p.born}</li>
        </ul>

        {p.intro && <p>{p.intro}</p>}

        {p.languages.length > 0 && (
          <>
            <h3>Languages</h3>
            <ul className="cv-languages">
              {p.languages.map((l, i) => (
                <li key={i} data-icon={l.flag}>
                  {l.lang}
                </li>
              ))}
            </ul>
          </>
        )}

        {p.hobbies && (
          <>
            <h3>Hobbies</h3>
            <ul>
              {p.hobbies.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="border1-e cv-personal-container">
      <img src={img} className="cv-profile-pic" alt="profile picture" />
      {details}
    </div>
  );
}
