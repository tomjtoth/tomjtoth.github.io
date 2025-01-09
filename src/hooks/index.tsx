import { useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "../store";

type Props = {
  initially?: string | number | boolean;
};

export function useField<T>(
  type: string,
  { initially = "", ...rest }: Props = {}
) {
  const [value, setValue] = useState(initially);

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
  };

  if (type === "checkbox") res.checked = value;
  else res.value = value;

  return new Proxy(res, {
    get: (target, prop) => {
      if (prop === "value" && type === "number") {
        return target.value === "" ? target.value : Number(target.value);
      }
      return target[prop];
    },
  });
}

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
