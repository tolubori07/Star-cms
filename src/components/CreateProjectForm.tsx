"use client";

import { useOptimistic, useState, useTransition } from "react";
import { createProject } from "@/app/dashboard/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateProjectForm({
  initialProjects,
}: {
  initialProjects: any[];
}) {
  const [pending, startTransition] = useTransition();
  const [projects, setProjects] = useOptimistic(initialProjects);
  const [formState, setFormState] = useState({ name: "", description: "" });
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempProject = {
      id: crypto.randomUUID(), // temporary
      name: formState.name,
      description: formState.description,
    };

    startTransition(async () => {
      setProjects((prev) => [...prev, tempProject]);
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("description", formState.description);
      const res = await createProject(formData).then(() => setOpen(false));
      //@ts-ignore
      if (res?.error)
        //@ts-ignore
        toast.error("Error creating project", { description: res?.error });
      router.refresh();
      toast.success("Project created", {
        description: "Project has been created successfully",
        classNames: { description: "!text-black" },
      });
    });

    setFormState({ name: "", description: "" });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <Button>
              New Project
              <LucidePlus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create A new project</DialogTitle>
              <DialogDescription>
                Fill out the form's details to start a new project
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Project name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="project name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Project description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="description..."
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="neutral">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
