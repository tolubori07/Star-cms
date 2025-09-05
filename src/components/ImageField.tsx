import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Props = {
  placeholder: string;
  label: string;
  value?: File | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
};

const ImageField = ({
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
        type="file"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
    </div>
  );
};

export default ImageField;
