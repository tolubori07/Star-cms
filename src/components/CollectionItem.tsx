"use client";

import Link from "next/link";

type Props = {
  name: string;
  id: string;
};
const CollectionItem = ({ name, id }: Props) => {
  return (
    <Link href={`/collections/${id}`}>
      <div className="bg-primary rounded-md h-[8rem] w-[16rem] p-8 shadow-md shadow-black hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
        <h2 className="text-xl font-bold font-heading">{name}</h2>
      </div>
    </Link>
  );
};

export default CollectionItem;
