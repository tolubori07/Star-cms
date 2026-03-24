import { prisma } from "@/db/prisma";
import { createClient } from "@/utils/supabase/client";
import { JsonObject } from "@prisma/client/runtime/library";

export async function getModelsWithFields(collectionId: string) {
  try {
    const model = await prisma.model.findUnique({
      where: { collectionId },
      include: { fields: true }, // if you want field definitions too
    });
    return model;
  } catch (error) {
    return { error };
  }
}

export async function getCollection(id: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id,
      },
    });
    return collection;
  } catch (error) {
    return { error };
  }
}

export async function createEntry(collectionId: string, entrydata: any) {
  try {
    await prisma.entry.create({
      data: {
        data: entrydata,
        collectionId: collectionId,
        name: entrydata.name,
      },
    });
  } catch (error) {
    return { error: error as String };
  }
}

export async function getEntry(id: string) {
  return await prisma.entry.findUnique({
    where: { id },
    include: {
      collection: {
        include: {
          Model: {
            include: {
              fields: true,
            },
          },
        },
      },
    },
  });
}

export const deleteEntry = async (entryId: string) => {
  try {
    await prisma.entry.delete({
      where: {
        id: entryId,
      },
    });
  } catch (error) {
    return { error: error };
  }
};

export const getPublicMediaUrl = (input: string) => {
  if (!input) return "";

  if (input.startsWith("http")) {
    return input;
  }

  const supabase = createClient();
  const { data } = supabase.storage.from("media").getPublicUrl(input);
  return data.publicUrl;
};

