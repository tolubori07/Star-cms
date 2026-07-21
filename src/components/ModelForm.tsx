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
import { getPublicMediaUrl } from "@/app/entry/utils";
import ImageCard from "./ui/image-card";
import ReferenceField from "./ReferenceField";
import MarkDownEditor from "./MarkDownEditor";
import RichTextEditor from "./tiptap/RichTextEditor";
import { useState } from "react";

type Props = {
  Fields: FieldDefinition[];
  collectionId: string;
  defaultValues?: Record<string, any>;
  id: string;
  entry: Entry;
  referencesMap: Record<string, Entry[]>;
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
  referencesMap,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!defaultValues;

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
        validator = z.coerce.number({ error: "Must be a number" });
        break;
      case "Richtext":
      case "Markdown":
        validator = z.string();
        break;
      case "Boolean":
        validator = z.boolean();
        break;
      case "Date":
        validator = z.coerce.date({ error: "Date is required" });
        break;
      case "Telephone":
        validator = z
          .string()
          .min(10, "Phone number is too short")
          .max(15, "Phone number is too long")
          .regex(/^(?:\+?\d[\d\s()-]*)$/, "Invalid phone number format");
        break;
      case "Image":
        // On edit, the value can be an existing path string or a new FileList
        validator = z
          .custom<FileList | string>(
            (val) => {
              if (typeof window === "undefined") return true;
              if (typeof val === "string") return true; // existing path
              return val instanceof FileList;
            },
            { message: "Input must be a file" },
          )
          .refine(
            (val) => {
              if (isEditing && typeof val === "string" && val.length > 0)
                return true; // existing image, skip required check
              return val instanceof FileList && val.length > 0;
            },
            { message: `${field.label} is required` },
          )
          .refine((val) => {
            if (typeof val === "string") return true;
            return val instanceof FileList && val[0]?.size <= MAX_FILE_SIZE;
          }, "Max image size is 10MB")
          .refine((val) => {
            if (typeof val === "string") return true;
            return (
              val instanceof FileList &&
              ACCEPTED_IMAGE_MIME_TYPES.includes(val[0]?.type)
            );
          }, "Only .jpg, .jpeg, .png and .webp formats are supported.");
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

  schemaShape["name"] = z.string().min(1, "Entry name is required");

  const formSchema = z.object(schemaShape);

  // Normalise defaultValues — convert strings back to the right types
  const normalisedDefaults = Object.fromEntries(
    Object.entries(defaultValues ?? {}).map(([key, value]) => {
      const field = Fields.find((f) => f.name === key);
      if (field?.type === "Date" && typeof value === "string") {
        return [key, new Date(value)];
      }
      if (field?.type === "Richtext" && typeof value !== "string") {
        return [key, ""];
      }
      if (field?.type === "Image" && typeof value === "string") {
        return [key, value]; // keep existing path as string
      }
      return [key, value];
    }),
  );

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
      ...normalisedDefaults,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      // Handle all image fields dynamically by field name
      for (const field of Fields) {
        if (field.type === "Image") {
          const fileList = values[field.name];
          if (fileList instanceof FileList && fileList.length > 0) {
            const file = fileList[0];
            const filePath = `${collectionId}/${Date.now()}-${file.name}`;

            const { data, error } = await supabase.storage
              .from("media")
              .upload(filePath, file, {
                cacheControl: "3600",
                contentType: file.type,
              });

            if (error) throw error;

            values[field.name] = data.path;
          } else if (
            typeof fileList === "string" ||
            defaultValues?.[field.name]
          ) {
            // Keep existing image path if no new file selected
            values[field.name] =
              typeof fileList === "string"
                ? fileList
                : defaultValues?.[field.name];
          }
        }
      }

      const res = isEditing
        ? await editEntryProxy(id, { ...entry, data: values })
        : await createEntryProxy(collectionId, values);

      if (res?.error) {
        toast.error("Failed to save entry", {
          description: String(res.error),
        });
        console.error(res.error);
      } else {
        toast.success(isEditing ? "Entry updated" : "Entry created");
        router.push(`/collections/${collectionId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-6 flex w-full max-w-6xl flex-col items-center"
      >
        <div className="w-full space-y-6 rounded-lg">
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
                        {defaultValues?.[field.name] && (
                          <ImageCard
                            caption="Current image"
                            className="mt-4 w-full"
                            imageUrl={getPublicMediaUrl(
                              defaultValues[field.name],
                            )}
                          />
                        )}
                      </div>
                    ) : field.type === "Boolean" ? (
                      <BooleanField
                        label={field.label}
                        {...rhfField}
                        checked={rhfField.value}
                      />
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
                        value={
                          typeof rhfField.value === "string"
                            ? rhfField.value
                            : ""
                        }
                      />
                    ) : field.type === "Reference" ? (
                      <ReferenceField
                        placeholder={field.placeholder || ""}
                        label={field.label || ""}
                        name={field.name}
                        value={rhfField.value}
                        onChange={rhfField.onChange}
                        entries={referencesMap[field.id] ?? []}
                      />
                    ) : field.type === "Richtext" ? (
                      <Controller
                        control={form.control}
                        name={field.name}
                        render={({ field: ctrl }) => (
                          <RichTextEditor
                            label={field.label}
                            value={ctrl.value}
                            onChange={ctrl.onChange}
                            onBlur={ctrl.onBlur}
                            name={field.name}
                          />
                        )}
                      />
                    ) : field.type === "Markdown" ? (
                      <Controller
                        control={form.control}
                        name={field.name}
                        render={({ field: ctrl }) => (
                          <MarkDownEditor
                            label={field.label}
                            value={ctrl.value}
                            onChange={ctrl.onChange}
                            onBlur={ctrl.onBlur}
                            name={field.name}
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Entry"
                : "Create Entry"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
