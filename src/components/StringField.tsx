import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  placeholder: string;
  label: string;
};

const StringField = ({ placeholder, label }: Props) => {
  return (
    <div className="w-3/5">
      <Label>{label}</Label>
      <Input type="text" placeholder={placeholder} />
    </div>
  );
};

export default StringField;
