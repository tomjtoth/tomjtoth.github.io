import { useEffect } from "react";

import {
  useSpinner,
  useAppDispatch,
  useAppSelector,
  useFiles,
} from "../../hooks";
import { tCV, tSpin } from "../../reducers";
import { isCV } from "../../types/cv/isCV";
import { ccToFlags } from "../../utils";

export function useFilesToCV() {
  const dispatch = useAppDispatch();

  return (list: FileList | File[]) =>
    new Promise<void>(async (done) => {
      if (list.length > 0) {
        dispatch(tSpin.show());

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

              dispatch(tCV.setCV(res));
            }
          } else if (!imgFound && file.type.startsWith("image")) {
            const reader = new FileReader();
            reader.onload = () => dispatch(tCV.setImg(reader.result as string));
            reader.readAsDataURL(file);
            imgFound = true;
          }

          if (imgFound && cvFound) break;
        }
        dispatch(tSpin.hide());
      }

      done();
    });
}

export default function useLogic() {
  const cv = useAppSelector((s) => s.cv.cv);
  const processFiles = useFilesToCV();
  const cxFiles = useFiles();
  const loaded = cv !== undefined;
  useSpinner(loaded);

  useEffect(() => {
    if (cxFiles.files.length > 0) {
      processFiles(cxFiles.files).then(cxFiles.reset);
    }
  }, [cxFiles.files]);
}
