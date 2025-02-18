import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "..";
import useSpinner from "../spinner";
import { setCV, setURL } from "../../reducers/cv";
import { ccToFlags } from "../../utils";

export default function useInitCV() {
  const dispatch = useAppDispatch();
  const spinner = useSpinner();
  const { cv } = useAppSelector((s) => s.cv);

  useEffect(() => {
    if (!cv) {
      spinner.show();
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
        spinner.hide();
      });
    }
  }, []);
}
