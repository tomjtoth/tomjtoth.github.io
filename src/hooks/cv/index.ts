import yaml from "js-yaml";

import { useAppDispatch, useAppSelector } from "..";
import { CVDetails, UseCV } from "../../types/cv";
import { setCV, setImg } from "../../reducers/cv";
import useSpinner from "../spinner";

export default function useCV() {
  const dispatch = useAppDispatch();
  const spinner = useSpinner();
  const rs = useAppSelector((s) => s.cv);

  async function fromFiles(list: FileList | File[]) {
    if (list.length > 0) {
      spinner.show();

      let cvFound = false;
      let imgFound = false;

      for (const file of list) {
        if (!cvFound && file.type === "application/yaml") {
          const res = (await yaml.load(await file.text())) as CVDetails;
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

      spinner.hide();
    }
  }

  return {
    ...rs,
    fromItems: (list) => {
      const fileList = [...list]
        .map((item) => item.getAsFile())
        .filter((f) => f != null);

      fromFiles(fileList);
    },
    fromFiles,
  } as UseCV;
}
