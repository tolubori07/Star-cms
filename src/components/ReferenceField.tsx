import React from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Entry } from "@prisma/client";

type Props = {
  placeholder: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  entries: Entry[];
};

const ReferenceField = ({
  placeholder,
  label,
  value,
  onChange,
  name,
  entries,
}: Props) => {
  return (
    <div className="w-full">
      <Label htmlFor={name}>{label}</Label>
      <Select
        value={value}
        onValueChange={(val) =>
          onChange?.({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)
        }
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder={placeholder || "Select a reference"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {entries.map((entry: Entry) => (
              <SelectItem value={entry.id} key={entry.id}>
                {entry.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
export default ReferenceField;
