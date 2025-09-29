"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  BinaryIcon,
  BoxesIcon,
  Calendar,
  CaseSensitiveIcon,
  Clock,
  File,
  Image,
  LetterText,
  ListOrderedIcon,
  LucidePlus,
  PaintBucket,
  Phone,
  Text,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { createField } from "@/app/collections/utils";
type Props = {
  initialFields: any[];
  modelId: string;
};
export default function CreateFieldForm({ initialFields, modelId }: Props) {
  const [pending, startTransition] = useTransition();
  const [fields, setFields] = useOptimistic(initialFields);
  const [formState, setFormState] = useState({
    name: "",
    label: "",
    placeholder: "",
    type: "",
    required: false,
  });
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempField = {
      id: crypto.randomUUID(), // temporary
      name: formState.name,
      label: formState.label,
      placeholder: formState.placeholder,
      type: formState.type,
      required: formState.required,
    };

    startTransition(async () => {
      setFields((prev) => [...prev, tempField]);
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("label", formState.label);
      formData.append("placeholder", formState.placeholder);
      formData.append("type", formState.type);
      formData.append("required", String(formState.required));
      const res = await createField(formData, modelId).then(() =>
        setOpen(false),
      );
      //@ts-ignore
      if (res?.error) {
        //@ts-ignore
        toast.error("Error creating field", { description: res?.error });
      }
      router.refresh();
      toast.success("Field created", {
        description: "Field has been created successfully",
        classNames: { description: "!text-black" },
      });
    });
    setFormState({
      name: "",
      label: "",
      placeholder: "",
      type: "",
      required: false,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="w-fit">
            <Button>
              New Field
              <LucidePlus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create A new field</DialogTitle>
              <DialogDescription>
                Fill out the form's details to create a new field{" "}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Field Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Field name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="label">Field label</Label>
                <Input
                  id="label"
                  name="label"
                  placeholder="Field label"
                  value={formState.label}
                  onChange={(e) =>
                    setFormState({ ...formState, label: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="placeholder">Field placeholder</Label>
                <Input
                  id="placeholder"
                  name="placeholder"
                  placeholder="Field placeholder"
                  value={formState.placeholder}
                  onChange={(e) =>
                    setFormState({ ...formState, placeholder: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Select
                  value={formState.type}
                  onValueChange={(value) =>
                    setFormState({ ...formState, type: value })
                  }
                >
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
                      <SelectItem value="Image">
                        <Image />
                        Image
                      </SelectItem>
                      <SelectItem value="Colour">
                        <PaintBucket />
                        Color
                      </SelectItem>
                      <SelectItem value="Telephone">
                        <Phone />
                        Phone
                      </SelectItem>
                      <SelectItem value="Time">
                        <Clock />
                        Time
                      </SelectItem>
                      <SelectItem value="File">
                        <File />
                        File
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Label htmlFor="requires">Required?</Label>
                <Checkbox
                  id="requires"
                  checked={formState.required}
                  onCheckedChange={(checked) =>
                    setFormState({ ...formState, required: Boolean(checked) })
                  }
                />{" "}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="neutral">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create field"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
