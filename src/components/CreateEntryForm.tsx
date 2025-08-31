"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
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
import { createEntry } from "@/app/collections/utils";
type Props = {
  initialEntries: any[];
  collectionId: string;
};
export default function CreateEntryForm({
  collectionId,
  initialEntries,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [entries, setEntries] = useOptimistic(initialEntries);
  const [formState, setFormState] = useState({ name: "" });
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempEntry = {
      id: crypto.randomUUID(), // temporary
      name: formState.name,
    };

    startTransition(async () => {
      setEntries((prev) => [...prev, tempEntry]);
      const formData = new FormData();
      formData.append("name", formState.name);
      const res = await createEntry(formData, collectionId);

      if (res?.error) {
        toast.error("Error creating entry", { description: res.error });
        console.error(res.error);
        return;
      }

      setOpen(false); // Only close if successful
      router.refresh();
      toast.success("Entry created", {
        description: "Entry has been created successfully",
        classNames: { description: "!text-black" },
      });
    });

    setFormState({ name: "" });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="w-fit">
            <Button>
              new entry
              <LucidePlus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create A new entry</DialogTitle>
              <DialogDescription>
                Fill out the form's details to create a new entry
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Entry name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Entry name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="neutral">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
