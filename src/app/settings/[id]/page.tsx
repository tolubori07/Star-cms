import { getProject } from "@/app/projects/utils";
import { getUserOrCreate } from "@/utils/supabase/server";
import { prisma } from "@/db/prisma";
import { updateProject } from "./actions";
import ApiKeySection from "@/components/ApiKeySection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUserOrCreate();
  const project = await getProject(id, user?.id);

  if (!project) return <div>Project not found</div>;

  const apiKeys = await prisma.apiKey.findMany({
    where: { projectId: id },
    select: { id: true, key: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const updateProjectWithId = updateProject.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-1">Project settings</h1>
        <p className="text-muted-foreground text-sm">{project.name}</p>
      </div>

      {/* General */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">General</h2>
        <form action={updateProjectWithId} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={project.name}
              className="max-w-sm"
            />
          </div>
          {project.description !== undefined && (
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                defaultValue={project.description ?? ""}
                className="max-w-sm"
              />
            </div>
          )}
          <Button type="submit">Save changes</Button>
        </form>
      </section>

      <hr className="border-border" />

      {/* API Keys */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">API keys</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Use these keys to fetch content from your project. Keys are shown once — copy them when created.
          </p>
        </div>
        <ApiKeySection
          projectId={id}
          userId={user?.id!}
          existingKeys={apiKeys.map((k) => ({
            id: k.id,
            preview: `${k.key.slice(0, 8)}${"•".repeat(24)}`,
            createdAt: k.createdAt.toISOString(),
          }))}
        />
      </section>
    </div>
  );
};

export default Page;
