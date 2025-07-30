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
import { createCollection } from "@/app/projects/utils";
type Props = {
  initialCollections: any[];
  projectId: string;
  userId: string|undefined;
};
export default function CreateCollectionForm({
  initialCollections,
  projectId,
  userId,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [collections, setCollections] = useOptimistic(initialCollections);
  const [formState, setFormState] = useState({ name: "" });
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempProject = {
      id: crypto.randomUUID(), // temporary
      name: formState.name,
    };

    startTransition(async () => {
      setCollections((prev) => [...prev, tempProject]);
      const formData = new FormData();
      formData.append("name", formState.name);
      const res = await createCollection(formData, projectId, userId).then(() =>
        setOpen(false),
      );
      //@ts-ignore
      if (res?.error)
        //@ts-ignore
        toast.error("Error creating collection", { description: res?.error });
      router.refresh();
      toast.success("Collection created", {
        description: "Collection has been created successfully",
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
              New Collection
              <LucidePlus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create A new collection</DialogTitle>
              <DialogDescription>
                Fill out the form's details to create a new collection
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Collection name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Collection name"
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
                {pending ? "Creating..." : "Create collection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
