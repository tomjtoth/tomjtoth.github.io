import { useContext, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "..";
import { AppDispatch } from "../../store";
import { setCV, setImg, setURL } from "../../reducers/cv";
import { hideSpinner, showSpinner } from "../../reducers/spinner";
import { TCV } from "../../types/cv";
import { ccToFlags } from "../../utils";
import { CxFiles } from "../../components/ViewRoot";

export function filesToCV(dispatch: AppDispatch, list: FileList | File[]) {
  return new Promise<void>(async (done) => {
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
          if ("personal" in res && "experience" in res && "education" in res) {
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

export default function useInitCV() {
  const dispatch = useAppDispatch();
  const { cv } = useAppSelector((s) => s.cv);
  const { files } = useContext(CxFiles)!;

  useEffect(() => {
    if (files) {
      filesToCV(dispatch, files);
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
