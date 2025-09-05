"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { FieldDefinition } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TextField from "./TextField";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";
import DateField from "./DateField";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createEntryAction } from "@/app/entry/actions";
import ImageField from "./ImageField";

type Props = {
  Fields: FieldDefinition[];
  collectionId: string;
};
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

export default function ModelForm({ Fields, collectionId }: Props) {
  const router = useRouter();
  // Build Zod schema dynamically
  const schemaShape: Record<string, any> = {};
  Fields.forEach((field) => {
    let validator: z.ZodTypeAny;

    switch (field.type) {
      case "Text":
      case "String":
        validator = z.string();
        break;
      case "Number":
        validator = z.number({ invalid_type_error: "Must be a number" });
        break;
      case "Boolean":
        validator = z.boolean();
        break;
      case "Date":
        validator = z.date({ required_error: "Date is required" });
        break;
      case "Image":
        validator = z
          .any()
          .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE;
          }, `Max image size is 5MB.`)
          .refine(
            (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported.",
          );
        break;
      default:
        validator = z.any();
    }

    if (field.required) {
      validator = validator.refine((val) => val !== "" && val !== null, {
        message: `${field.label} is required`,
      });
    } else {
      validator = validator.optional();
    }

    schemaShape[field.name] = validator;
  });

  // Add "name" for Entry name
  schemaShape["name"] = z.string().min(1, "Entry name is required");

  const formSchema = z.object(schemaShape);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: Fields.reduce(
      (acc, field) => {
        acc[field.name] = field.type === "Boolean" ? false : "";
        return acc;
      },
      { name: "" } as Record<string, any>,
    ),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await createEntryAction(collectionId, values);
    if (res?.error) {
      toast.error("Failed to create entry", {
        description: "There was an error while creating your entry",
      });
      console.log(res.error);
    } else {
      router.push(`/collections/${collectionId}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center"
      >
        <div className=" w-full space-y-6 rounded-lg">
          {/* Entry name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Entry name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter entry name..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic fields */}
          {Fields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.name}
              render={({ field: rhfField }) => (
                <FormItem className="w-full">
                  <FormControl>
                    {field.type === "Text" ? (
                      <TextField
                        placeholder={field.placeholder || ""}
                        label={field.label}
                        {...rhfField}
                      />
                    ) : field.type === "String" ? (
                      <StringField
                        placeholder={field.placeholder || ""}
                        label={field.label}
                        {...rhfField}
                      />
                    ) : field.type === "Number" ? (
                      <NumberField
                        placeholder={field.placeholder || ""}
                        label={field.label}
                        {...rhfField}
                      />
                    ) : field.type === "Image" ? (
                      <ImageField
                        placeholder={field.placeholder || ""}
                        label={field.label}
                        {...rhfField}
                      />
                    ) : field.type === "Boolean" ? (
                      <BooleanField label={field.label} {...rhfField} />
                    ) : field.type === "Date" ? (
                      <Controller
                        control={form.control}
                        name={field.name}
                        render={({ field: ctrl }) => (
                          <DateField
                            placeholder={field.placeholder || "Pick a date"}
                            value={ctrl.value}
                            onChange={ctrl.onChange}
                          />
                        )}
                      />
                    ) : null}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full">
            Save Entry
          </Button>
        </div>
      </form>
    </Form>
  );
}
