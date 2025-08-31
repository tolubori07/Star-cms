"use server";
import { prisma } from "@/db/prisma";
import { JsonValue } from "@/generated/prisma/runtime/library";
import { getUserOrCreate } from "@/utils/supabase/server";
import { FieldType, Model } from "@prisma/client";

export const getCollection = async (
  collectionId: string,
): Promise<{
  id: string;
  name: string;
  createdAt: Date;
} | null> => {
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });
  return collection;
};

export async function getEntries(collectionId: string): Promise<
  {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    collectionId: string;
    data: JsonValue;
  }[]
> {
  const entries = await prisma.entry.findMany({
    where: {
      collectionId,
    },
  });
  return entries;
}

export async function createEntry(formData: FormData, collectionId: string) {
  const name = formData.get("name") as string;

  if (!name) return { error: "A name must be provided for the project" };
  try {
    await prisma.entry.create({
      data: {
        name,
        collectionId,
        data: { text: "" },
      },
    });
  } catch (error) {
    return { error: error };
  }
}

export async function getUserCollections(userId: string) {
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });

  const projectIds = projects.map((project) => project.id);

  const collections = await prisma.collection.findMany({
    where: {
      projectId: { in: projectIds },
    },
  });

  return collections;
}

export async function createModel(collectionId: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return { error: "A name must be provided for the model" };

  try {
    const model = await prisma.model.create({
      data: {
        name,
        collectionId,
      },
    });

    return model;
  } catch (error) {
    return { error: "Something went wrong while creating the model" };
  }
}

export async function getModel(collectionId: string):Promise<Model> {
  try {
    const model = await prisma.model.findUnique({
      where: { collectionId: collectionId },
    });
    return model
  } catch (error) {
    return { error: error };
  }
}

export const createField = async (formData: FormData, modelId: string) => {
  const name = formData.get("name") as string;
  const label = formData.get("label") as string;
  const type = formData.get("type") as FieldType;
  const required = formData.get("required") === "true"; // convert to boolean
  const placeholder = formData.get("placeholder") as string;

  if (!name || !label || !type) {
    return { error: "Missing required field data" };
  }

  try {
    const field = await prisma.fieldDefinition.create({
      data: {
        name,
        label,
        type,
        placeholder,
        required,
        modelId,
      },
    });
    return field;
  } catch (error) {
    console.error("Prisma error creating field:", error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

export const getFields = async (modelId: string) => {
  const field = await prisma.fieldDefinition.findMany({
    where: { modelId: modelId },
  });
  return field;
};

export const deleteField = async (fieldId: string) => {
  try {
    await prisma.fieldDefinition.delete({
      where: {
        id: fieldId,
      },
    });
  } catch (error) {
    return { error: error };
  }
};
