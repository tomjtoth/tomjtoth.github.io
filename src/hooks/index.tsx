import { useState } from "react";

export function useField(type, { initially = "", ...rest } = {}) {
  const [value, setValue] = useState(initially);

  const onChange = (event) => {
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
