"use client";

import { Entry } from "@prisma/client";
import EntryItem from "./EntryItem";

export default function EntryList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <h2 className="text-xl font-main font-bold text-center">
        No entries yet
      </h2>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {entries.map((e) => (
        <EntryItem
          key={e.id}
          name={e.name}
          //@ts-ignore
          id={e.id}
        />
      ))}
    </div>
  );
}
