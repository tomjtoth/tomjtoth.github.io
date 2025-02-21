import { useAppSelector } from "../../hooks";

export default function Skills() {
  const cv = useAppSelector((s) => s.cv.cv);

  let res = null;

  if (cv) {
    res = (
      <div>
        <h3 className="cv">Skills</h3>
        <ul id="cv-skills">
          {cv.skills.map((skill, i) => (
            <li key={i} className="cv-tip" title={`cv.skills[${i}]`}>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return res;
}
