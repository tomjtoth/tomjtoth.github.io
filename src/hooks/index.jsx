import { useState } from "react";

export function useField(type, { initially = "", ...rest } = {}) {
  const [value, setValue] = useState(initially);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue(initially);
  };

  return new Proxy(
    {
      ...rest,
      type,
      value,
      onChange,
      reset,
    },
    {
      get: (target, prop) => {
        if (prop === "value" && type === "number") {
          return Number(target.value);
        }
        return target[prop];
      },
    }
  );
}
