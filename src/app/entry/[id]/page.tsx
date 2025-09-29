import React from "react";
import { getEntry } from "../utils";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const entry = await getEntry(id);
  const data = entry.data as Record<string, any>;

  return (
    <div>
      {Object.entries(data).map(([field, value]) => (
        <div key={field}>
          <strong>{field}:</strong> {String(value)}
        </div>
      ))}
    </div>
  );
};

export default Page;
