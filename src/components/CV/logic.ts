import { useContext, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { setCV, setImg, setURL } from "../../reducers/cv";
import { hideSpinner, showSpinner } from "../../reducers/spinner";
import { TCV } from "../../types/cv";
import { ccToFlags } from "../../utils";
import { CxFiles } from "../ViewRoot";

export function useFilesToCV() {
  const dispatch = useAppDispatch();

  return (list: FileList | File[]) =>
    new Promise<void>(async (done) => {
      if (list.length > 0) {
        dispatch(showSpinner());

        let cvFound = false;
        let imgFound = false;

        for (const file of list) {
          if (!cvFound && file.type === "application/yaml") {
            const [asStr, { default: YAML }] = await Promise.all([
              file.text(),
              import("js-yaml"),
            ]);

            const replaced = ccToFlags(asStr);

            const res = (await YAML.load(replaced)) as TCV;
            if (
              "personal" in res &&
              "experience" in res &&
              "education" in res
            ) {
              cvFound = true;

              dispatch(setCV(res));
            }
          } else if (!imgFound && file.type.startsWith("image")) {
            const reader = new FileReader();
            reader.onload = () => dispatch(setImg(reader.result as string));
            reader.readAsDataURL(file);
            imgFound = true;
          }

          if (imgFound && cvFound) break;
        }

        dispatch(hideSpinner());
      }

      done();
    });
}

export default function useLogic() {
  const dispatch = useAppDispatch();
  const cv = useAppSelector((s) => s.cv.cv);
  const files = useContext(CxFiles)!.files;
  const processFiles = useFilesToCV();

  useEffect(() => {
    if (files) {
      processFiles(files);
    } else if (!cv) {
      dispatch(showSpinner());
      Promise.all([
        import("js-yaml"),
        import("../../assets/cv.yaml?url").then(({ default: url }) => {
          dispatch(setURL(url));

          return fetch(url).then((res) => res.text());
        }),
      ]).then(([YAML, strYaml]) => {
        const flagsReplaced = ccToFlags(strYaml);
        const parsed = YAML.load(flagsReplaced);

        dispatch(setCV(parsed));
        dispatch(hideSpinner());
      });
    }
  }, [files]);
}
