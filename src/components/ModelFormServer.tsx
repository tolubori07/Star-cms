import React from "react";
import ModelForm from "./ModelForm";
import { FieldDefinition } from "@prisma/client";
type Props = {
  collectionId: string;
  Fields: FieldDefinition[];
};
const ModelFormServer = ({ collectionId, Fields }: Props) => {
  return <ModelForm collectionId={collectionId} Fields={Fields} />;
};

export default ModelFormServer;
