import { getUserOrCreate } from "@/utils/supabase/server";
import { getCollection, getEntries, createEntry } from "../utils";
import CreateEntryForm from "@/components/CreateEntryForm";
import CollectionList from "@/components/CollectionList";
import EntryList from "@/components/EntryList";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUserOrCreate();
  //@ts-ignore
  const collection = await getCollection(id);
  //@ts-ignore
  const entries = await getEntries(collection?.id);
  return (
    <div className="p-4">
      <h1 className="text-center font-bold font-heading text-3xl">
        {collection?.name}
      </h1>
      <CreateEntryForm initialEntries={entries} collectionId={collection?.id} />
      {entries.length === 0 ? (
        <h2 className="text-xl font-main font-bold text-center mt-4">
          We await the new entry
        </h2>
      ) : (
        <EntryList entries={entries} />
      )}
    </div>
  );
};
export default Page;
