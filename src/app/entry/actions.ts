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



export async function deleteEntryAction(id: string) {
  try {
    await prisma.entry.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

