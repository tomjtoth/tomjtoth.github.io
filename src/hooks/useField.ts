import { useState } from "react";
import {
  CheckboxInputProps,
  FieldType,
  NumberInputProps,
  Props,
  TextInputProps,
} from "../types/hooks";

export default function useField(
  type: FieldType,
  { initially = "", ...rest }: Props = {}
) {
  const [value, setValue] = useState<string | number | boolean>(initially);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(type === "checkbox" ? !value : event.target.value);
  };

  const reset = () => {
    setValue(initially);
  };

  const res = {
    ...rest,
    type,
    onChange,
    reset,
    ...(type === "checkbox" ? { checked: value as boolean } : { value }),
  } as TextInputProps | NumberInputProps | CheckboxInputProps;

  return new Proxy(res, {
    get: (target, prop: keyof React.InputHTMLAttributes<HTMLInputElement>) => {
      if (prop === "value" && type === "number") {
        return target.value === "" ? target.value : Number(target.value);
      }
      return target[prop];
    },
  });
}
