import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "..";
import useSpinner from "../spinner";
import { fetchYaml } from "../../utils";
import { setCV } from "../../reducers/cv";
import { CVDetails } from "../../types/cv";

export default function useInitCV() {
  const dispatch = useAppDispatch();
  const spinner = useSpinner();
  const { cv } = useAppSelector((s) => s.cv);

  console.debug("cv", cv);

  useEffect(() => {
    if (!cv) {
      spinner.show();
      fetchYaml("/cv-template.yaml").then((yaml: CVDetails) => {
        dispatch(setCV(yaml));
        spinner.hide();
      });
    }
  }, []);
}
