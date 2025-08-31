"use client";

import { useState, useTransition } from "react";
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
import { createModel } from "@/app/collections/utils";

type Props = {
  hasModel: boolean;
  collectionId: string;
};

export default function CreateModelForm({ hasModel, collectionId }: Props) {
  const [pending, startTransition] = useTransition();
  const [formState, setFormState] = useState({ name: "" });
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", formState.name);

      const res = await createModel(collectionId, formData);

      //@ts-ignore
      if (res?.error) {
        //@ts-ignore
        toast.error("Error creating model", { description: res?.error });
        return;
      }

      setOpen(false);
      setFormState({ name: "" });

      toast.success("Model created", {
        description: "Model has been created successfully",
        classNames: { description: "!text-black" },
      });

      // Instead of redirecting, refresh the collection page so the "Model" tab updates
      router.refresh();
    });
  };

  if (hasModel) {
    return null; // don’t render button if model exists
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-fit">
          <Button>
            New Model
            <LucidePlus className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new model</DialogTitle>
            <DialogDescription>
              Fill out the form to create your model.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Model name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Model name"
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
              {pending ? "Creating..." : "Create model"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

