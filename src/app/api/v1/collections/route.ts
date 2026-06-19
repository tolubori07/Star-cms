import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/validateRequest";
import { prisma } from "@/db/prisma";

// GET /api/v1/collections
// Returns all collections belonging to the project the API key is scoped to.
export async function GET(req: NextRequest) {
  const auth = await validateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const collections = await prisma.collection.findMany({
    where: { projectId: auth.apiKey.projectId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: { select: { entries: true } },
    },
  });

  return NextResponse.json({ data: collections });
}
