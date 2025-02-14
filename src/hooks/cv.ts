import { useEffect } from "react";
import yaml from "js-yaml";

import { useAppDispatch, useAppSelector } from ".";
import { CVDetails, UseCV } from "../types/cv";
import { setCV, setImg } from "../reducers/cv";
import { fetchYaml } from "../utils";
import useSpinner from "./spinner";

export default function useCV() {
  const dispatch = useAppDispatch();
  const spinner = useSpinner();
  const { cv, img } = useAppSelector((s) => s.cv);

  console.debug("cv", cv, "img", img);

  useEffect(() => {
    if (!cv) {
      spinner.show();
      fetchYaml("/cv-template.yaml").then((yaml) => {
        dispatch(setCV(yaml));
        spinner.hide();
      });
    }
  }, []);

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
    cv,
    img,
    fromItems: (list) => {
      const fileList = [...list]
        .map((item) => item.getAsFile())
        .filter((f) => f != null);

      fromFiles(fileList);
    },
    fromFiles,
  } as UseCV;
}
