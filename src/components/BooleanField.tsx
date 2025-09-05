import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type Props = {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
};

const BooleanField = ({ label, checked, onChange, name }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={name}
        checked={checked}
        onCheckedChange={onChange}
        name={name}
      />
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
};

export default BooleanField;
