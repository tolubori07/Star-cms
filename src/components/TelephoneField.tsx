"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
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

const COUNTRY_CODES = [
  { label: "🇬🇧 UK", value: "+44" },
  { label: "🇳🇬 Nigeria", value: "+234" },
  { label: "🇺🇸 USA", value: "+1" },
];

type Props = {
  placeholder: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
};

export default function TelephoneField({
  placeholder,
  label,
  value,
  onChange,
  onBlur,
  name,
}: Props) {
  const [code, setCode] = useState("+44");
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (!value) return;

    // Match a leading +countrycode (1–3 digits)
    const match = value.match(/^(\+\d{1,3})(.*)$/);

    if (match) {
      const incomingCode = match[1];
      const incomingNumber = match[2];

      setCode(incomingCode);
      setNumber(incomingNumber);
    }
  }, [value]);
  const updateFullValue = (newCode: string, newNumber: string) => {
    const cleaned = newNumber.replace(/^0/, "");
    const combined = `${newCode}${cleaned}`;
    onChange?.(combined);
  };

  return (
    <div className="w-full">
      <Label htmlFor={name}>{label}</Label>

      <div className="flex gap-2">
        <Select
          value={code}
          onValueChange={(newCode) => {
            setCode(newCode);
            updateFullValue(newCode, number);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Country code</SelectLabel>
              {COUNTRY_CODES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {`${c.label} (${c.value})`}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          id={name}
          type="tel"
          placeholder={placeholder}
          value={number}
          onChange={(e) => {
            const newNumber = e.target.value;
            setNumber(newNumber);
            updateFullValue(code, newNumber);
          }}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}
