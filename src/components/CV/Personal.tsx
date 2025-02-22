import { useAppSelector } from "../../hooks";

export default function Personal() {
  const cv = useAppSelector((s) => s.cv.cv);
  const img = useAppSelector((s) => s.cv.img);

  let details = null;

  if (cv) {
    const p = cv.personal;
    document.title = `CV of ${p.lastname}, ${p.firstname}`;

    const prefix = "cv.personal";

    details = (
      <div>
        <div style={{ textAlign: "center" }}>
          <b className="cv-tip" title={`${prefix}.firstname`}>
            {p.firstname.toUpperCase()}
          </b>{" "}
          <span
            id="cv-lastname"
            className="cv-tip"
            title={`${prefix}.lastname`}
          >
            {p.lastname.toUpperCase()}
          </span>
        </div>
        <ul className="cv-personal-data">
          <li data-icon="📞" className="cv-tip" title={`${prefix}.phone`}>
            <a href={`tel:${p.phone}`}>{p.phone}</a>
          </li>

          <li data-icon="✉️" className="cv-tip" title={`${prefix}.email`}>
            <a href={`mailto:${p.email}`}>{p.email}</a>
          </li>

          {p.website && (
            <li data-icon="🌐" className="cv-tip" title={`${prefix}.website`}>
              <a href={p.website} target="_blank">
                {p.website.replace("https://", "")}
              </a>
            </li>
          )}

          <li data-icon="📍" className="cv-tip" title={`${prefix}.location`}>
            {p.location}
          </li>

          {p.citizenship.map(({ flag, nationality }, i) => (
            <li
              data-icon={flag}
              key={i}
              className="cv-tip"
              title={`${prefix}.citizenship[${i}]`}
            >
              {nationality}
            </li>
          ))}

          <li data-icon="🎂" className="cv-tip" title={`${prefix}.born`}>
            {p.born}
          </li>
        </ul>

        {p.intro && (
          <p id="cv-intro" className="cv-tip" title={`${prefix}.intro`}>
            {p.intro}
          </p>
        )}

        {p.languages.length > 0 && (
          <>
            <h3 className="cv">Languages</h3>
            <ul className="cv-languages">
              {p.languages.map((l, i) => (
                <li
                  key={i}
                  data-icon={l.flag}
                  className="cv-tip"
                  title={`${prefix}.languages[${i}]`}
                >
                  {l.lang}
                </li>
              ))}
            </ul>
          </>
        )}

        {p.hobbies && (
          <>
            <h3 className="cv">Hobbies</h3>
            <ul className="cv-hobbies">
              {p.hobbies.map((h, i) => (
                <li
                  key={i}
                  className="cv-tip"
                  title={`${prefix}.hobbies[${i}]`}
                >
                  {h}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  return (
    <div id="cv-personal-container" className="border1-e">
      <div id="cv-img-container">
        <img src={img} alt="profile picture" draggable={false} />
      </div>
      {details}
    </div>
  );
}
