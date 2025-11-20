import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  placeholder: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
};
const TimeField = ({
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
        type="time"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
    </div>
  );
};

export default TimeField;
