export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  initially?: string | number | boolean;
};

export type FieldType = "text" | "number" | "checkbox";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type: FieldType;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
};

export type TextInputProps = InputProps & {
  type: "text";
  value: string;
};

export type NumberInputProps = InputProps & {
  type: "number";
  value: string | number;
};

export type CheckboxInputProps = InputProps & {
  type: "checkbox";
  checked: boolean;
};
