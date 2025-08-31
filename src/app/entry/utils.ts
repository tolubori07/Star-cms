import { prisma } from "@/db/prisma";

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
