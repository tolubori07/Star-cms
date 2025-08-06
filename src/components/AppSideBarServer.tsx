import { getUserOrCreate } from "@/utils/supabase/server";
import AppSidebarClient from "./AppSideBarClient";
import { getUserProjects } from "@/app/dashboard/utils";
import { getUserCollections } from "@/app/collections/utils";
import { getUserProjectsWithCollectionsandModels } from "@/app/projects/utils";

const AppSideBarServer = async () => {
  const user = await getUserOrCreate();
  const projects = await getUserProjectsWithCollectionsandModels(user?.id);
  return <AppSidebarClient  Projects={projects} />;
};

export default AppSideBarServer;
