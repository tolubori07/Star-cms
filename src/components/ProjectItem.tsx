"use client";

import Link from "next/link";

type Props = {
  name: string;
  description: string;
  id: string;
};
const ProjectItem = ({ name, description, id }: Props) => {
  return (
    <Link href={`projects/${id}`}>
      <div className="bg-primary rounded-[1.8rem] h-[12rem] w-[16rem] p-8 bg-main shadow-black shadow-md hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
        <h2 className="text-xl font-bold font-heading">{name}</h2>
        <p className="text-lg font-main">{description}</p>
      </div>
    </Link>
  );
};

export default ProjectItem;
