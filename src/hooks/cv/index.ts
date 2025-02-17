import { useAppDispatch, useAppSelector } from "..";
import { TCV, UseCV } from "../../types/cv";
import { setCV, setImg } from "../../reducers/cv";
import useSpinner from "../spinner";
import { ccToFlags } from "../../utils";

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

      spinner.hide();
    }
  }

  const fromItems = (list: DataTransferItemList) => {
    const fileList = [...list]
      .map((item) => item.getAsFile())
      .filter((f) => f != null);

    fromFiles(fileList);
  };

  return {
    ...rs,

    onDragEnter: () => {},
    onDrop: (ev) => {
      ev.preventDefault();

      if (ev.dataTransfer!.items) {
        fromItems(ev.dataTransfer!.items);
      } else {
        fromFiles(ev.dataTransfer!.files);
      }
    },

    fromFiles,
  } as UseCV;
}
