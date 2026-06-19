import { NextRequest, NextResponse } from "next/server";
import {
  validateRequest,
  assertCollectionInProject,
} from "@/lib/validateRequest";
import { prisma } from "@/db/prisma";

// GET /api/v1/collections/:collectionId/schema
// Returns the model and field definitions for a collection.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> },
) {
  const { collectionId } = await params;

  const auth = await validateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const collection = await assertCollectionInProject(
    collectionId,
    auth.apiKey.projectId,
  );

  if (!collection) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  const model = await prisma.model.findUnique({
    where: { collectionId },
    include: {
      fields: { orderBy: { name: "asc" } },
    },
  });

  if (!model) {
    return NextResponse.json({ error: "Schema not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: model.id,
      name: model.name,
      fields: model.fields,
    },
  });
}
