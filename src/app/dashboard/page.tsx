import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import { getUserProjects } from "./utils";
import { getUser, getUserOrCreate } from "@/utils/supabase/server";

const Page = async () => {
  const user = await getUserOrCreate();
  const projects = await getUserProjects(user?.id);
  return (
    <div>
      <div className="">
        <Button>
          New Project
          <LucidePlus />
        </Button>
      </div>

      {projects.length === 0 ? (
        <h2 className="text-xl font-main font-bold text-center mt-4">
          Your dashboard’s feeling lonely... Give it some love with a new
          project.
        </h2>
      ) : (
        <ul className="mt-4 space-y-2">
          {projects.map((p) => (
            <li key={p.id} className="text-center font-main text-lg">
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
