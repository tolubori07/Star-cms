import React from "react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

type Props = {
  placeholder: string;
  label: string;
};

const TextField = ({ placeholder, label }: Props) => {
  return (
    <div className="w-3/5">
      <Label>{label}</Label>
      <Textarea placeholder={placeholder} />
    </div>
  );
};

export default TextField;
