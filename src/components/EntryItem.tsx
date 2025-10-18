"use client";

import { deleteEntryAction } from "@/app/entry/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  name: string;
  id: string;
};

const EntryItem = ({ name, id }: Props) => {
  const router = useRouter();

  const entryDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await deleteEntryAction(id);

    if (res?.error) {
      toast.error("Error deleting entry", { description: res.error });
      return;
    }

    toast.success("Entry deleted", {
      description: "Entry has been deleted successfully",
      classNames: { description: "!text-black" },
    });

    router.refresh();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative rounded-base border-2 border-border bg-main p-6 h-[8rem] w-[16rem] shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-pointer"
      onClick={() => router.push(`/entry/${id}`)}
    >
      <Trash2
        className="absolute top-3 right-3 w-5 h-5 text-muted-foreground hover:text-destructive transition-colors z-10"
        onClick={entryDelete}
      />
      <h2 className="text-xl font-heading font-bold truncate mt-6">{name}</h2>
    </div>
  );
};

export default EntryItem;
