"use client";
type Props = {
  name: string;
  description: string;
};
const ProjectItem = ({ name, description}: Props) => {
  return (
    <div className="shadow-shadow bg-main rounded-base">
      <h2 className="text-xl font-bold font-heading">{name}</h2>
      <p className="text-lg font-main">{description}</p>
    </div>
  );
};

export default ProjectItem;
