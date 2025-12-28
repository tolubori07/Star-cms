"use server";
import { prisma } from "@/db/prisma";

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



