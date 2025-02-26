import { useContext, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { cv as cvr, spin } from "../../reducers";
import { isCV } from "../../types/cv/isCV";
import { ccToFlags } from "../../utils";
import { CxFiles } from "../ViewRoot";

export function useFilesToCV() {
  const dispatch = useAppDispatch();

  return (list: FileList | File[]) =>
    new Promise<void>(async (done) => {
      if (list.length > 0) {
        dispatch(spin.show());

        let cvFound = false;
        let imgFound = false;

        for (const file of list) {
          if (!cvFound && file.type === "application/yaml") {
            const [asStr, { default: YAML }] = await Promise.all([
              file.text(),
              import("js-yaml"),
            ]);

            const replaced = ccToFlags(asStr);

            const res = await YAML.load(replaced);
            if (isCV(res)) {
              cvFound = true;

              dispatch(cvr.setCV(res));
            }
          } else if (!imgFound && file.type.startsWith("image")) {
            const reader = new FileReader();
            reader.onload = () => dispatch(cvr.setImg(reader.result as string));
            reader.readAsDataURL(file);
            imgFound = true;
          }

          if (imgFound && cvFound) break;
        }

        dispatch(spin.hide());
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
      dispatch(spin.hide());
      Promise.all([import("js-yaml"), import("../../assets/cv.yaml?raw")]).then(
        ([YAML, { default: strYaml }]) => {
          const flagsReplaced = ccToFlags(strYaml);
          const parsed = YAML.load(flagsReplaced);

          const blob = new Blob([strYaml], { type: "application/yaml" });
          const blobUrl = URL.createObjectURL(blob);

          dispatch(cvr.setURL(blobUrl));
          dispatch(cvr.setCV(parsed));
          dispatch(spin.hide());
        }
      );
    }
  }, [files]);
}
