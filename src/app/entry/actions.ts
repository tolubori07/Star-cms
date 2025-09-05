// app/entry/actions.ts
"use server";

import { prisma } from "@/db/prisma";

export async function createEntryAction(collectionId: string, data: any) {
  try {
    await prisma.entry.create({
      data: {
        data,
        collectionId,
        name: data.name,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

