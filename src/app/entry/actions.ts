// app/entry/actions.ts
"use server";

import { prisma } from "@/db/prisma";
import { Entry } from "@prisma/client";

export async function createEntryAction(collectionId: string, data: any) {
  console.log(data)
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

export async function editEntryAction(id: string, entry: Entry) {
  try {
    await prisma.entry.update({
      where: { id },
      data: {
        name: entry.name,
        data: entry.data,
        collectionId: entry.collectionId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating entry:", error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
