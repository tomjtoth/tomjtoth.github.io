import { useEffect } from "react";
import YAML from "js-yaml";

import { useAppDispatch, useAppSelector } from "..";
import useSpinner from "../spinner";
import { setCV, setURL } from "../../reducers/cv";

export default function useInitCV() {
  const dispatch = useAppDispatch();
  const spinner = useSpinner();
  const { cv } = useAppSelector((s) => s.cv);

  console.debug("cv", cv);

  useEffect(() => {
    if (!cv) {
      spinner.show();
      import("../../assets/cv.yaml").then((asset) => {
        const parsed = asset.default;
        dispatch(setCV(parsed));

        const yamlStr = YAML.dump(parsed);
        const blob = new Blob([yamlStr], { type: "application/yaml" });
        const url = URL.createObjectURL(blob);
        dispatch(setURL(url));

        spinner.hide();
      });
    }
  }, []);
}
