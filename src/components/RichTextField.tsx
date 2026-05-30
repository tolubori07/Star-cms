"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Label } from "./ui/label";

type Props = {
  placeholder?: string;
  label: string;
  value?: Record<string, any>;
  onChange?: (value: Record<string, any>) => void;
  onBlur?: () => void;
  name?: string;
};

const RichTextField = ({
  placeholder,
  label,
  value,
  onChange,
  onBlur,
  name,
}: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class:
          "border rounded-md p-2 min-h-32 w-full focus:outline-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
  });

  return (
    <div className="w-full">
      <Label htmlFor={name} className="mb-2">
        {label}
      </Label>
      <EditorContent editor={editor} id={name} />
    </div>
  );
};

export default RichTextField;
