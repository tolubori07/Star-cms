"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Entry, FieldDefinition } from "@prisma/client";
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
import { Label } from "./ui/label";
import { createClient } from "@/utils/supabase/client";
import TelephoneField from "./TelephoneField";
import TimeField from "./TimeField";
import ColorField from "./ColorField";
import { createEntryProxy, editEntryProxy } from "../lib/entryActionProxy";

type Props = {
  Fields: FieldDefinition[];
  collectionId: string;
  defaultValues?: Record<string, any>;
  id: string;
  entry: Entry;
};

const MAX_FILE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

export default function ModelForm({
  Fields,
  collectionId,
  defaultValues,
  id,
  entry,
}: Props) {
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
        validator = z.coerce.number({ invalid_type_error: "Must be a number" });
        break;
      case "Boolean":
        validator = z.boolean();
        break;
      case "Date":
        validator = z.coerce.date({ required_error: "Date is required" });
        break;
      case "Telephone":
        validator = z
          .string()
          .min(10, "Phone number is too short")
          .max(15, "Phone number is too long")
          .regex(/^(?:\+?\d[\d\s()-]*)$/, "Invalid phone number format");
        break;
      case "Image":
        validator = z
          .custom<FileList>(
            (val) => {
              if (typeof window === "undefined") return true; // Skip on server
              return val instanceof FileList;
            },
            { message: "Input must be a File" },
          )
          .refine((files) => files && (files as FileList).length > 0, {
            message: `${field.label} is required`,
          })
          .refine(
            (files) => files && (files as FileList)[0]?.size <= MAX_FILE_SIZE,
            `Max image size is 10MB`,
          )
          .refine(
            (files) =>
              files &&
              ACCEPTED_IMAGE_MIME_TYPES.includes((files as FileList)[0]?.type),
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
    defaultValues: {
      ...Fields.reduce(
        (acc, field) => {
          acc[field.name] = field.type === "Boolean" ? false : "";
          return acc;
        },
        { name: "" } as Record<string, any>,
      ),
      ...defaultValues,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const supabase = createClient();

      // 1. Upload image if present
      if (values.img instanceof FileList && values.img.length > 0) {
        const file = values.img[0];

        const filePath = `${collectionId}/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
          .from("media")
          .upload(filePath, file, {
            cacheControl: "3600",
            contentType: file.type,
          });

        if (error) throw error;

        values.img = data.fullPath;
        console.log(values);
      }
      const res = defaultValues
        ? await editEntryProxy(id, { ...entry, data: values })
        : await createEntryProxy(collectionId, values);

      if (res?.error) {
        toast.error("Failed to create entry");
        console.log(res?.error);
      } else {
        router.push(`/collections/${collectionId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
                      <div className="w-full">
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <FormControl>
                          <Input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.map(
                              (ext) => `.${ext}`,
                            ).join(", ")}
                            onChange={(e) => {
                              rhfField.onChange(e.target.files);
                            }}
                          />
                        </FormControl>
                      </div>
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
                    ) : field.type === "Telephone" ? (
                      <TelephoneField
                        placeholder={field.placeholder || ""}
                        label={field.label}
                        name={field.name}
                        value={rhfField.value}
                        onChange={rhfField.onChange}
                        onBlur={rhfField.onBlur}
                      />
                    ) : field.type === "Time" ? (
                      <TimeField
                        placeholder={field.placeholder || ""}
                        label={field.label}
                        {...rhfField}
                      />
                    ) : field.type === "Colour" ? (
                      <ColorField
                        placeholder={field.placeholder || ""}
                        label={field.label}
                        {...rhfField}
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
