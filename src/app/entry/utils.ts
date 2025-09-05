import { prisma } from "@/db/prisma";
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

export async function createEntry(collectionId: string, data: any) {
  try {
    await prisma.entry.create({
      data: {
        data: data,
        collectionId: collectionId,
        name: data.name,
      },
    });
  } catch (error) {
    return { error:error as String };
  }
}
