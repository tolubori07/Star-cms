import React from "react";
import ModelForm from "./ModelForm";
import { Collection, Entry, FieldDefinition } from "@prisma/client";
type Props = {
  collectionId: string;
  Fields: FieldDefinition[];
  collections: Collection[];
  id:string;
  entries: Entry[];
  collections: Collection[];
};
const ModelFormServer = ({ collectionId, Fields, collections, entries }: Props) => {
  return <ModelForm collectionId={collectionId} Fields={Fields} collections={collections} entries={entries}/>;
};

export default ModelFormServer;
