import { prisma } from "@/db/prisma";

export async function getUserProjects(
  userId: string,
): Promise<
  {
    name: string;
    id: string;
    createdAt: Date;
    slug: string;
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
