import { getUserOrCreate } from "@/utils/supabase/server";
import { getUserProjects } from "./utils";
import CreateProjectForm from "@/components/CreateProjectForm";
import ProjectList from "@/components/ProjectList";

const Page = async () => {
  const user = await getUserOrCreate();
  const projects = await getUserProjects(user?.id);

  return (
    <div className="p-4">
      <CreateProjectForm initialProjects={projects} />
      {projects.length === 0 ? (
        <h2 className="text-xl font-main font-bold text-center mt-4">
          Your dashboard’s feeling lonely... Give it some love with a new project.
        </h2>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
};

export default Page;

