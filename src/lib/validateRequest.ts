import { createHash } from "crypto";
import { prisma } from "@/db/prisma";

type ValidationResult =
  | { apiKey: { id: string; projectId: string; userId: string } }
  | { error: string; status: number };

export async function validateRequest(req: Request): Promise<ValidationResult> {
  const incoming = req.headers.get("x-api-key");

  if (!incoming) {
    return { error: "Missing API key", status: 401 };
  }

  const hashed = createHash("sha256").update(incoming).digest("hex");

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashed },
    select: { id: true, projectId: true, userId: true },
  });

  if (!apiKey) {
    return { error: "Invalid API key", status: 401 };
  }

  return { apiKey };
}

// Verifies a collection belongs to the project the API key is scoped to.
// Call this after validateRequest whenever a collectionId is in the route.
export async function assertCollectionInProject(
  collectionId: string,
  projectId: string
) {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { id: true, projectId: true },
  });

  if (!collection || collection.projectId !== projectId) {
    return null;
  }

  return collection;
}
