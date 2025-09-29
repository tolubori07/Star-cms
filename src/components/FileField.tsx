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

const FileField = ({
  placeholder,
  label,
  onChange,
  onBlur,
  name,
}: Props) => {
  return (
    <div>
         <Input
        id={name}
        placeholder={placeholder}
        type="file"
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
    </div>
  );
};

export default FileField;
