import { getEntry } from "../utils";
import ModelForm from "@/components/ModelForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const entry = await getEntry(id);

  if (!entry) return <div>Entry not found</div>;

  const fields = entry.collection.Model[0].fields;
  const data = entry.data as Record<string, any>;

  return (
    <div className="flex justify-center mt-8">
      <ModelForm
        Fields={fields}
        collectionId={entry.collectionId}
        defaultValues={data} 
      />
    </div>
  );
};

export default Page;
