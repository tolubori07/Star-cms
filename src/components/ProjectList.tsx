"use client";

import { Project } from "@prisma/client";
import ProjectItem from "./ProjectItem";

export default function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <h2 className="text-xl font-main font-bold text-center">
        Your dashboard’s feeling lonely... Give it some love with a new project.
      </h2>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((p) => (
        <ProjectItem
          key={p.id}
          name={p.name}
          description={p.description}
          slug={p.slug}
        />
      ))}
    </div>
  );
}

