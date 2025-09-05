import { notFound } from "next/navigation";
import React from "react";
import { getCollection, getModelsWithFields } from "../utils";
import { Collection, Model } from "@prisma/client";
import { Field } from "react-hook-form";
import ModelForm from "@/components/ModelForm";
import ModelFormServer from "@/components/ModelFormServer";

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
  const fields: Field[] = model.fields;
  //@ts-ignore
  const collection: Collection = await getCollection(collectionId);
  return (
    <div className="w-full">
      <h1 className="text-center text-foreground text-2xl">
        Entry for {collection.name}
      </h1>
      {/*@ts-ignore*/}
        <ModelFormServer Fields={fields} collectionId={collectionId} />
    </div>
  );
};

export default page;
