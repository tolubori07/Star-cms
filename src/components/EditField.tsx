import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FieldDefinition, FieldType } from "@prisma/client";
import {
  BinaryIcon,
  Calendar,
  CaseSensitiveIcon,
  Clock,
  File,
  Image,
  ListOrderedIcon,
  PaintBucket,
  Phone,
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
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { updateField } from "@/app/collections/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FIELD_TYPE_OPTIONS = [
  { value: "Text", label: "Text", icon: Text },
  { value: "String", label: "String", icon: CaseSensitiveIcon },
  { value: "Boolean", label: "Boolean", icon: BinaryIcon },
  { value: "Number", label: "Number", icon: ListOrderedIcon },
  { value: "Date", label: "Date", icon: Calendar },
  { value: "Image", label: "Image", icon: Image },
  { value: "Colour", label: "Color", icon: PaintBucket },
  { value: "Telephone", label: "Phone", icon: Phone },
  { value: "Time", label: "Time", icon: Clock },
  { value: "File", label: "File", icon: File },
] as const;

type Props = { Field: FieldDefinition; children: ReactNode };

const formSchema = z.object({
  name: z.string().min(1, "Field name must be at least 1 character"),
  label: z.string().min(1, "Field label must be at least 1 character"),
  placeholder: z.string().optional(),
  type: z.enum(FieldType),
  required: z.boolean(),
});

function EditField({ Field, children }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: Field.name,
      label: Field.label,
      placeholder: Field.placeholder ?? "",
      type: Field.type,
      required: Field.required,
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //@ts-ignore
    const res = await updateField(Field.id, values);

    if (res.success) {
      toast.success("Field updated successfully.");
      router.refresh();
      //@ts-ignore
      document.querySelector("[data-close-sheet]")?.click();
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit field definition</SheetTitle>
          <SheetDescription>
            Make changes to your field's definition here.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 px-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select a type</SelectLabel>
                            {FIELD_TYPE_OPTIONS.map((opt) => {
                              const Icon = opt.icon;
                              return (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button data-close-sheet variant="default">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditField;
