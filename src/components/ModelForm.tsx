import { FieldDefinition } from "@prisma/client";
import TextField from "./TextField";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";
import DateField from "./DateField";

type Props = {
  Fields: FieldDefinition[];
};

const ModelForm = ({ Fields }: Props) => {
  return (
    <div className="w-full flex flex-col gap-5 mt-8 items-center">
      {Fields.map((field) => {
        switch (field.type) {
          case "Text":
            return (
              <TextField
                key={field.id}
                placeholder={field.placeholder || ""}
                label={field.label}
              />
            );
          case "String":
            return (
              <StringField
                placeholder={field.placeholder || ""}
                label={field.label}
                key={field.id}
              />
            );
          case "Number":
            return (
              <NumberField
                label={field.label}
                placeholder={field.placeholder || ""}
                key={field.id}
              />
            );
          case "Boolean":
            return <BooleanField key={field.id} label={field.label} />;
          case "Date":
            return (
              <DateField placeholder={field.placeholder || ""} key={field.id} />
            );
        }
      })}
    </div>
  );
};

export default ModelForm;
