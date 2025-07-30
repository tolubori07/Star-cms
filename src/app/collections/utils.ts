"use server";
import { prisma } from "@/db/prisma";
import { JsonValue } from "@/generated/prisma/runtime/library";
import { getUserOrCreate } from "@/utils/supabase/server";

export const getCollection = async (
  collectionId: string,
): Promise<{
  id: string;
  name: string;
  createdAt: Date;
} | null> => {
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });
  return collection;
};

export async function getEntries(collectionId: string): Promise<
  {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    collectionId: string;
    data: JsonValue;
  }[]
> {
  const entries = await prisma.entry.findMany({
    where: {
      collectionId: collectionId,
    },
  });
  return entries;
}

export async function createEntry(formData: FormData, collectionId: string) {
  const collection = await getCollection(collectionId);
  const name = formData.get("name") as string;

  if (!name) return { error: "A name must be provided for the project" };
  try {
    await prisma.entry.create({
      data: {
        name,
        collectionId: collection?.id,
        data: { text: "" },
      },
    });
  } catch (error) {
    return { error: error };
  }
}

export async function getUserCollections(userId: string) {
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });

  const projectIds = projects.map((project) => project.id);

  const collections = await prisma.collection.findMany({
    where: {
      projectId: { in: projectIds },
    },
  });

  return collections;
}
