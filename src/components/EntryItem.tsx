"use client";

import Link from "next/link";

type Props = {
  name: string;
  id: string;
};

const EntryItem = ({ name, id }: Props) => {
  return (
    <Link href={`/entries/${id}`} className="block">
      <div
        role="link"
        className="flex items-center justify-start rounded-base border-border border-2 bg-main p-6 h-[8rem] w-[16rem] shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-pointer"
      >
        <h2 className="text-xl font-heading font-bold truncate">{name}</h2>
      </div>
    </Link>
  );
};

export default EntryItem;
