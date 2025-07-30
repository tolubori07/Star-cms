"use client";

import Link from "next/link";

type Props = {
  name: string;
  id: string;
};
const CollectionItem = ({ name, id }: Props) => {
  return (
    <Link href={`/collections/${id}`}>
      <div className="bg-main rounded-base h-[8rem] w-[16rem] p-8 bg-main border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
        <h2 className="text-xl font-bold font-heading">{name}</h2>
      </div>
    </Link>
  );
};

export default CollectionItem;
