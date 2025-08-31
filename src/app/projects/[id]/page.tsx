import { getUserOrCreate } from "@/utils/supabase/server";
import { getCollections, getModels, getProject } from "../utils";
import CreateCollectionForm from "@/components/CreateCollectionForm";
import CreateModelForm from "@/components/CreateModelForm";
import CollectionList from "@/components/CollectionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelList from "@/components/ModelList";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUserOrCreate();
  //@ts-ignore
  const project = await getProject(id, user?.id);
  //@ts-ignore
  const collections = await getCollections(project?.id);
  return (
   
        <div className="p-4">
          <h1 className="text-center font-bold font-heading text-3xl">
            {project?.name}
          </h1>
          <h2 className="text-center font-bold font-main text-lg">
            {project?.description}
          </h2>
          <CreateCollectionForm
            initialCollections={collections}
            projectId={id}
            userId={user?.id}
          />
          {collections.length === 0 ? (
            <h2 className="text-xl font-main font-bold text-center mt-4">
              Your dashboard’s feeling lonely... Give it some love with a new
              project.
            </h2>
          ) : (
            //@ts-ignore
            <CollectionList collections={collections} />
          )}
        </div>
        );
};
export default Page;
