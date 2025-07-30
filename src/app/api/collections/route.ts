import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const collections = await prisma.collection.findMany({
    where: { projectId },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return NextResponse.json(collections);
}
