"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type Props = {
  placeholder: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  name?: string;
};

export default function DateField({ placeholder, value, onChange }: Props) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(value);

  const handleChange = (date: Date | undefined) => {
    setInternalDate(date);
    onChange?.(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="noShadow"
          className="w-full justify-start text-left font-base"
        >
          <CalendarIcon className="mr-2" />
          {internalDate ? (
            format(internalDate, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-0! p-0">
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
