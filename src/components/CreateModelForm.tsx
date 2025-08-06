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
import { createModel } from "@/app/projects/utils";
type Props = {
  initialModels: any[];
  projectId: string;
  userId: string | undefined;
};
export default function CreateModelForm({
  initialModels,
  projectId,
  userId,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [models, setModels] = useOptimistic(initialModels);
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
      setModels((prev) => [...prev, tempProject]);
      const formData = new FormData();
      formData.append("name", formState.name);
      const res = await createModel(projectId, formData).then(() =>
        setOpen(false)
      );
      //@ts-ignore
      if (res?.error)
        //@ts-ignore
        toast.error("Error creating model", { description: res?.error });
      router.refresh();
      toast.success("Model created", {
        description: "Model has been created successfully",
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
              New Model
              <LucidePlus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create A new model</DialogTitle>
              <DialogDescription>
                Fill out the form's details to create a new model{" "}
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
    </>
  );
}
