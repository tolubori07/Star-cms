import { Badge } from "@/components/ui/badge";
import EditField from "./EditField";
import { FieldDefinition } from "@prisma/client";
import FieldDropDown from "./FieldDropDown";

type Props = {
  Field: FieldDefinition;
};

const FieldItem = ({ Field }: Props) => {
  return (
    <div className="rounded-lg border border-border bg-white shadow-shadow mt-5 p-4 w-[80%]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-base">{Field.label}</h3>
          <p className="text-muted-foreground">Field name: {Field.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={Field.required ? "default" : "neutral"}>
            {Field.required ? "Required" : "Optional"}
          </Badge>
          <FieldDropDown field={Field}/>
        </div>
      </div>

      {/* Body */}
      <div className="mt-3 space-y-2">
        <p className="text-sm text-muted-foreground">
          Placeholder:{" "}
          <span className="italic text-foreground/80">
            {Field.placeholder || "—"}
          </span>
        </p>

        <Badge variant="neutral" className="text-xs capitalize">
          {Field.type}
        </Badge>
      </div>
    </div>
  );
};

export default FieldItem;
