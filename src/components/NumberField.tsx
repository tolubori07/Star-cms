import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Props = {
  placeholder: string;
  label: string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
};

const NumberField = ({
  placeholder,
  label,
  value,
  onChange,
  onBlur,
  name,
}: Props) => {
  return (
    <div className="w-full">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        placeholder={placeholder}
        type="number"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
    </div>
  );
};

export default NumberField;
