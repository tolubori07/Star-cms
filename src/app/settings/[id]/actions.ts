"use server";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { randomBytes, createHash } from "crypto";

export async function updateProject(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "Name is required" };

  await prisma.project.update({
    where: { id },
    data: { name, ...(description && { description }) },
  });

  revalidatePath(`/projects/${id}/settings`);
  return { success: true };
}

export async function createApiKey(
  userId: string,
  projectId: string,
): Promise<{ raw: string } | { error: string }> {
  const raw = randomBytes(32).toString("hex");
  const hashed = createHash("sha256").update(raw).digest("hex");

  try {
    await prisma.apiKey.create({
      data: {
        key: hashed,
        userId,
        projectId,
      },
    });

    revalidatePath(`/projects/${projectId}/settings`);
    return { raw };
  } catch (error) {
    return { error: "Failed to create API key" };
  }
}

export async function deleteApiKey(
  keyId: string,
  projectId: string,
): Promise<{ success: boolean } | { error: string }> {
  try {
    await prisma.apiKey.delete({ where: { id: keyId } });
    revalidatePath(`/projects/${projectId}/settings`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete key" };
  }
}
