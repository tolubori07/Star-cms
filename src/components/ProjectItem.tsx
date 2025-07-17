"use client";

import Link from "next/link";

type Props = {
  name: string;
  description: string;
  id: string;
};
const ProjectItem = ({ name, description, id}: Props) => {
  return (
    <Link href={`project/${id}`}>
      <div className="bg-main rounded-base h-[12rem] w-[16rem] p-8 bg-main border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
        <h2 className="text-xl font-bold font-heading">{name}</h2>
        <p className="text-lg font-main">{description}</p>
      </div>
    </Link>
  );
};

export default ProjectItem;
