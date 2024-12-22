import { useState } from "react";

export default function (type, initially = "") {
  const [value, setValue] = useState(initially);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
}
