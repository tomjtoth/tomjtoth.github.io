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
        <div className="text-center">
          <b className="cv-tip uppercase" title={`${prefix}.firstname`}>
            {p.firstname}
          </b>{" "}
          <span
            className="cv-tip text-fg-2 uppercase"
            title={`${prefix}.lastname`}
          >
            {p.lastname}
          </span>
        </div>

        <ul className="cv-personal-data list-none pl-5 *:mt-1 *:relative before *:pl-3 *:marker:content-[attr(data-icon)]">
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

          <li data-icon="🗓️" className="cv-tip" title={`${prefix}.born`}>
            {p.born}
          </li>
        </ul>

        {p.intro && (
          <p className="cv-tip text-justify" title={`${prefix}.intro`}>
            {p.intro}
          </p>
        )}

        {p.languages.length > 0 && (
          <>
            <h3>LANGUAGES</h3>
            <ul className="list-none pl-5 *:mt-1 *:relative *:pl-3 *:marker:content-[attr(data-icon)]">
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
            <h3>HOBBIES</h3>
            <ul className="pl-5">
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
    <div
      id="cv-personal-container"
      className="border-r flex flex-col px-4 w-4/10 items-center"
    >
      <div
        id="cv-img-container"
        className="w-[200px] h-[200px] overflow-hidden border-2 inline-block my-4 rounded-[50%]"
      >
        <img
          src={img}
          alt="profile picture"
          draggable={false}
          className="w-full h-full object-cover"
        />
      </div>
      {details}
    </div>
  );
}
