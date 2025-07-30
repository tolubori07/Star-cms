"use server";
import { prisma } from "@/db/prisma";
import { getUserOrCreate } from "@/utils/supabase/server";

export const getProject = async (
  projectId: string,
  userId: string | undefined,
): Promise<{
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  ownerId: string;
} | null> => {
  const project = await prisma.project.findUnique({
    where: {
      ownerId: userId,
      id: projectId,
    },
  });
  return project;
};

export async function getCollections(projectId: string): Promise<
  {
    name: string;
    id: string;
    createdAt: Date;
  }[]
> {
  const collections = await prisma.collection.findMany({
    where: {
      projectId: projectId,
    },
  });
  return collections;
}

export async function createCollection(
  formData: FormData,
  projectId: string,
  userId: string | undefined,
) {
  const project = await getProject(projectId, userId);
  const name = formData.get("name") as string;

  if (!name) return { error: "A name must be provided for the project" };
  try {
    await prisma.collection.create({
      data: {
        name,
        projectId: project?.id,
      },
    });
  } catch (error) {
    return { error: error };
  }
}

export async function getUserProjectsWithCollections(userId: string|undefined) {
  return await prisma.project.findMany({
    where: { ownerId: userId },
    include: {
      collections: true,
    },
  });
}
