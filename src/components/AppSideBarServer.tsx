import { getUserOrCreate } from "@/utils/supabase/server";
import AppSidebarClient from "./AppSideBarClient";
import { getUserProjectsWithCollectionsAndModels } from "@/app/projects/utils";

const AppSideBarServer = async () => {
  const user = await getUserOrCreate();
  const projects = await getUserProjectsWithCollectionsAndModels(user?.id);
  return <AppSidebarClient Projects={projects} />;
};

export default AppSideBarServer;
