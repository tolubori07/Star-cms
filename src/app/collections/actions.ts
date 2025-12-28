import { prisma } from "@/db/prisma";
import { FieldDefinition } from "@prisma/client";

export const editFieldAction = async (id: string, field: FieldDefinition) => {
  try {
    await prisma.fieldDefinition.update({
      where: { id },
      data: {
        name: field.name,
        type: field.type,
        placeholder: field.placeholder,
        label: field.label,
        required: field.required,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating entry:", error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};
