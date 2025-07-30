"use client";

import { Collection } from "@prisma/client";
import CollectionItem from "./CollectionItem";

export default function CollectionList({
  collections,
}: {
  collections: Collection[];
}) {
  if (collections.length === 0) {
    return (
      <h2 className="text-xl font-main font-bold text-center">
        No collections yet
      </h2>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-6 gap-4">
      {collections.map((c) => (
        <CollectionItem
          key={c.id}
          name={c.name}
          //@ts-ignore
          id={c.id}
        />
      ))}
    </div>
  );
}
