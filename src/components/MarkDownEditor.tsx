"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { Label } from "./ui/label";
import { useEffect } from "react";
import { Placeholder } from "@tiptap/extensions/placeholder"

type Props = {
  placeholder?: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
};

const MarkDownEditor = ({
  placeholder,
  label,
  value,
  onChange,
  onBlur,
  name,
}: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Write something...",
      }),
    ],
    content: value || "",
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getMarkdown());
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

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getMarkdown();
    if (value !== undefined && value !== current) {
      editor.commands.setContent(value, false); // false = don't emit update
    }
  }, [value, editor]);

  return (
    <div className="w-full">
      <Label htmlFor={name} className="mb-2">
        {label}
      </Label>
      <EditorContent editor={editor} id={name} />
    </div>
  );
};

export default MarkDownEditor;
