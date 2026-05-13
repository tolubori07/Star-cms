import { notFound } from "next/navigation";
import React from "react";
import { getCollection, getModelsWithFields } from "../utils";
import { Collection, FieldDefinition, Model, Entry } from "@prisma/client";
import ModelForm from "@/components/ModelForm";
import ModelFormServer from "@/components/ModelFormServer";
import { getAllCollections, getAllEntries } from "@/app/collections/utils";

type Props = {
  searchParams: {
    collectionId?: string;
    modelId?: string;
  };
};

const page = async ({ searchParams }: Props) => {
  const { collectionId, modelId } = searchParams;
  if (!collectionId || !modelId) {
    return notFound();
  }
  //@ts-ignore
  const model: Model = await getModelsWithFields(collectionId);
  //@ts-ignore
  const fields: FieldDefinition[] = model.fields;
  //@ts-ignore
  const collection: Collection = await getCollection(collectionId);
  const referencesMap: Record<string, Entry[]> = {};
  for (const field of fields) {
    if (field.type === "Reference" && field.referenceCollectionId) {
      const entries = await getAllEntries(field.referenceCollectionId);
      referencesMap[field.id] = entries ?? [];
    }
  }
return (
  <div className="w-full">
    <h1 className="text-center text-foreground text-2xl">
      Entry for {collection.name}
    </h1>
    <ModelFormServer
      Fields={fields}
      collectionId={collectionId}
      referencesMap={referencesMap}
    />
  </div>
);
};

export default page;
