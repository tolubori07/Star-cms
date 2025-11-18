"use client";

import { LucidePlus } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  modelId: string;
  collectionId: string;
};

const NewEntryButton = ({ modelId, collectionId }: Props) => {
  const router = useRouter();
  const hasModel = modelId == "" ? false : true;

  return (
    <Button
      onClick={() => {
        if (hasModel) {
          router.push(
            `/entry/new?modelId=${modelId}&collectionId=${collectionId}`,
          );
        } else {
          toast.error("You need to create a model first");
        }
      }}
    >
      New Entry <LucidePlus className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default NewEntryButton;
