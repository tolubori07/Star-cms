import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FieldDefinition } from "@prisma/client";
import {
  BinaryIcon,
  BoxesIcon,
  Calendar,
  CaseSensitiveIcon,
  EllipsisVertical,
  ListOrderedIcon,
  Text,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ReactNode } from "react";

type Props = {
  Field: FieldDefinition;
  children: ReactNode;
};

function EditField({ Field, children }: Props) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit field definition</SheetTitle>
          <SheetDescription>
            Make changes to your field's definition here. Click save when
            you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue={Field.name} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Label</Label>
            <Input id="sheet-demo-name" defaultValue={Field.label} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Placeholder</Label>
            <Input
              id="sheet-demo-username"
              defaultValue={Field.placeholder || ""}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  <>
                    <BoxesIcon />
                    Select a type
                  </>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a type</SelectLabel>
                <SelectItem value="Text">
                  <Text />
                  Text
                </SelectItem>
                <SelectItem value="String">
                  <CaseSensitiveIcon />
                  String
                </SelectItem>
                <SelectItem value="Boolean">
                  <BinaryIcon />
                  Boolean
                </SelectItem>
                <SelectItem value="Number">
                  <ListOrderedIcon />
                  Number
                </SelectItem>
                <SelectItem value="Date">
                  <Calendar />
                  Date
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Required?</Label>
            <Checkbox defaultChecked={Field.required} />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="default">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
export default EditField;
