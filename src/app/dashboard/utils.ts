"use server";
import { prisma } from "@/db/prisma";
import { getUserOrCreate } from "@/utils/supabase/server";

export async function getUserProjects(userId: string): Promise<
  {
    name: string;
    id: string;
    createdAt: Date;
    description: string | null;
    ownerId: string;
  }[]
> {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
  });
  return projects;
}

export async function createProject(formData: FormData) {
  const user = await getUserOrCreate();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "A name must be provided for the project" };
  try {
    await prisma.project.create({
      data: {
        name,
        description: description || "",
        ownerId: user?.id,
      },
    });
  } catch (error) {
    return { error: error };
  }
}
