import { useAppSelector } from "../../hooks";

export default function Skills() {
  const cv = useAppSelector((s) => s.cv.cv);

  let res = null;

  if (cv) {
    res = (
      <div>
        <h3>SKILLS</h3>
        <ul id="cv-skills" className="pl-5 *:marker:content-['✓__']">
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
