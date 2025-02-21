import { TCV } from ".";

export function isCV(obj: any): obj is TCV {
  return (
    "personal" in obj &&
    "experience" in obj &&
    "education" in obj &&
    "skills" in obj
  );
}
