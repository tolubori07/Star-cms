import { NextRequest, NextResponse } from "next/server";
import { validateRequest, assertCollectionInProject } from "@/lib/validateRequest";

// GET /api/v1/collections/:collectionId
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

  return NextResponse.json({ data: collection });
}
