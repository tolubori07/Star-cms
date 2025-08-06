"use client";

import { Model } from "@prisma/client";
import ModelItem from "./ModelItem";

export default function ModelList({ models }: { models: Model[] }) {
  if (models.length === 0) {
    return (
      <h2 className="text-xl font-main font-bold text-center">No models yet</h2>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-6 gap-4">
      {models.map((m) => (
        <ModelItem
          key={m.id}
          name={m.name}
          //@ts-ignore
          id={m.id}
        />
      ))}
    </div>
  );
}
