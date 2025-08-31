"use server";
import { prisma } from "@/db/prisma";
import { getUserOrCreate } from "@/utils/supabase/server";
import { FieldType } from "@prisma/client";

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

/*export async function getModel(modelId: string): Promise<{
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
} | null> {
  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });
  return model;
}*/


