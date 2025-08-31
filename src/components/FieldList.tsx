import { FieldDefinition } from "@prisma/client";
import React from "react";
import FieldItem from "./FieldItem";

type Props = {
  fields: FieldDefinition[];
};

const FieldList = ({ fields }: Props) => {
  return (
    <div className="grid grid-cols-2">
      {fields.map((field) => (
        <FieldItem key={field.id} Field={field} />
      ))}
    </div>
  );
};

export default FieldList;
