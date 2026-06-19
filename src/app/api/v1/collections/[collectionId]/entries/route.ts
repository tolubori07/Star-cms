import { NextRequest, NextResponse } from "next/server";
import { validateRequest, assertCollectionInProject } from "@/lib/validateRequest";
import { prisma } from "@/db/prisma";

// GET /api/v1/collections/:collectionId/entries
// Query params:
//   ?page=1&limit=20
//   ?search=shirt        (matches entry name)
//   ?sortBy=createdAt&order=desc
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  const { collectionId } = await params;

  const auth = await validateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const collection = await assertCollectionInProject(
    collectionId,
    auth.apiKey.projectId
  );

  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
  const search = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  const validSortFields = ["createdAt", "updatedAt", "name"];
  const resolvedSort = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  const where = {
    collectionId,
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [entries, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      orderBy: { [resolvedSort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.entry.count({ where }),
  ]);

  return NextResponse.json({
    data: entries,
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    },
  });
}
