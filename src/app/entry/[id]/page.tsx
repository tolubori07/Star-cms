import { getEntry } from "../utils";
import { getAllEntries } from "@/app/collections/utils";
import { Entry, FieldDefinition } from "@prisma/client";
import ModelForm from "@/components/ModelForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) return <div>Entry not found</div>;

  const fields: FieldDefinition[] = entry.collection.Model[0].fields;
  const data = entry.data as Record<string, any>;

  const referencesMap: Record<string, Entry[]> = {};
  for (const field of fields) {
    if (field.type === "Reference" && field.referenceCollectionId) {
      const entries = await getAllEntries(field.referenceCollectionId);
      referencesMap[field.id] = entries ?? [];
    }
  }

  return (
    <div className="flex justify-center mt-8">
      <ModelForm
        Fields={fields}
        collectionId={entry.collectionId}
        defaultValues={data}
        entry={entry}
        id={entry.id}
        referencesMap={referencesMap}
      />
    </div>
  );
};

export default Page;
