import { NextRequest, NextResponse } from "next/server";
import {
  validateRequest,
  assertCollectionInProject,
} from "@/lib/validateRequest";
import { prisma } from "@/db/prisma";

// GET /api/collections/:collectionId/entries/:entryId
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string; entryId: string }> },
) {
  const { collectionId, entryId } = await params;

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

  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
  });

  if (!entry || entry.collectionId !== collectionId) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ data: entry });
}

// PATCH /api/collections/:collectionId/entries/:entryId
// Body: { name?: string, data?: Record<string, any> }
// `data` is merged shallowly into the existing entry data (partial update),
// not replaced wholesale — so you can update one field without resending all of them.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string; entryId: string }> },
) {
  const { collectionId, entryId } = await params;

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

  const existing = await prisma.entry.findUnique({
    where: { id: entryId },
  });

  if (!existing || existing.collectionId !== collectionId) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  let body: { name?: string; data?: Record<string, any> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, data } = body;

  if (name === undefined && data === undefined) {
    return NextResponse.json(
      { error: "Provide at least one of: name, data" },
      { status: 400 },
    );
  }

  // Validate incoming data keys against the collection's field definitions,
  // so a typo'd field name doesn't silently get stored as junk.
  if (data) {
    const model = await prisma.model.findUnique({
      where: { collectionId },
      include: { fields: true },
    });

    const validFieldNames = new Set(model?.fields.map((f) => f.name) ?? []);
    const unknownKeys = Object.keys(data).filter(
      (key) => !validFieldNames.has(key),
    );

    if (unknownKeys.length > 0) {
      return NextResponse.json(
        { error: `Unknown field(s): ${unknownKeys.join(", ")}` },
        { status: 400 },
      );
    }

    // enforce required fields aren't being explicitly cleared
    const requiredFields = model?.fields.filter((f) => f.required) ?? [];
    for (const field of requiredFields) {
      if (
        field.name in data &&
        (data[field.name] === null || data[field.name] === "")
      ) {
        return NextResponse.json(
          { error: `Field "${field.name}" is required and cannot be empty` },
          { status: 400 },
        );
      }
    }
  }

  const existingData = (existing.data as Record<string, any>) ?? {};

  const updated = await prisma.entry.update({
    where: { id: entryId },
    data: {
      ...(name !== undefined && { name }),
      ...(data !== undefined && { data: { ...existingData, ...data } }),
    },
  });

  return NextResponse.json({ data: updated });
}
