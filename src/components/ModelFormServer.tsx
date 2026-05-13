import React from "react";
import ModelForm from "./ModelForm";
import { Entry, FieldDefinition } from "@prisma/client";

type Props = {
  collectionId: string;
  Fields: FieldDefinition[];
  referencesMap: Record<string, Entry[]>;
  id?: string;
};

const ModelFormServer = ({ collectionId, Fields, referencesMap, id }: Props) => {
  return (
    <ModelForm
      collectionId={collectionId}
      Fields={Fields}
      referencesMap={referencesMap}
      id={id ?? ""}
    />
  );
};

export default ModelFormServer;
