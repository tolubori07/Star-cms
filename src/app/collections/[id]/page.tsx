import {
  getCollection,
  getEntries,
  createEntry,
  getFields,
  getModel,
} from "../utils";
import EntryList from "@/components/EntryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateModelForm from "@/components/CreateModelForm";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import Link from "next/link";
import CreateFieldForm from "@/components/CreateFieldForm";
import FieldList from "@/components/FieldList";
import { Model } from "@prisma/client";
import { getUserOrCreate } from "@/utils/supabase/server";
import { toast } from "sonner";
import NewEntryButton from "@/components/NewEntryButton";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const collection = await getCollection(id);
  const entries = await getEntries(id);
  const model: Model = await getModel(id);
  const fields = model ? await getFields(model.id) : [];
  const user = await getUserOrCreate();
  const hasFields = fields.length == 0 ? false : true;

  return (
    <Tabs defaultValue="entries">
      <TabsList>
        <TabsTrigger value="entries">Entries</TabsTrigger>
        <TabsTrigger value="model">Model</TabsTrigger>
      </TabsList>

      {/* Entries Tab */}
      <TabsContent value="entries">
        <div className="p-4">
          <h1 className="text-center font-bold font-heading text-3xl">
            {collection?.name}
          </h1>
          <NewEntryButton modelId={model ? model.id : ""} collectionId={id} />
          {entries.length === 0 ? (
            <h2 className="text-xl font-main font-bold text-center mt-4">
              We await the new entry
            </h2>
          ) : (
            <EntryList entries={entries} />
          )}
        </div>
      </TabsContent>

      {/* Model Tab */}
      <TabsContent value="model">
        <div className="p-4">
          <h1 className="text-center font-bold font-heading text-3xl">
            {collection?.name}
          </h1>

          {!model ? (
            <>
              <h2 className="text-xl font-main font-bold text-center mt-4">
                You have no model yet
              </h2>
              {/*@ts-ignore*/}
              <CreateModelForm collectionId={id} userId={user?.id} />
            </>
          ) : (
            <div className="p-4">
              <h1 className="text-center font-bold font-heading text-3xl">
                {model.name}
              </h1>
              <CreateFieldForm initialFields={fields} modelId={model.id} />
              {fields.length > 0 ? (
                <FieldList fields={fields} />
              ) : (
                <h2>
                  Your model is yet to take form, there are infinite
                  possibilities.
                </h2>
              )}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
export default Page;
