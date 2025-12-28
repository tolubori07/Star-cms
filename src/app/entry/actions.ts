// app/entry/actions.ts
"use server";

import { prisma } from "@/db/prisma";
import { createClient } from "@/utils/supabase/client";
import { Entry } from "@prisma/client";

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

export const fetchSignedMediaUrl = async (filepath: string) => {
  const supabase = createClient();
  try {
    const { data } = await supabase.storage.from("media").createSignedUrl(filepath, 60)
    return data?.signedUrl;
  } catch (error) {
    console.log(error)
  }
};
