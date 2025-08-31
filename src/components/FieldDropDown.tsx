"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteIcon, Edit, EllipsisVertical } from "lucide-react";
import EditField from "./EditField";
import { FieldDefinition } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { deleteField } from "@/app/collections/utils";

type Props = {
  field: FieldDefinition;
};

const FieldDropDown = ({ field }: Props) => {
  const router = useRouter();
  const [open,setOpen] = useState(false)
  const fieldDelete = async () => {
    const res = await deleteField(field.id).then(()=>setOpen(false));
    if (res?.error) {
      //@ts-ignore
      toast.error("Error deleting field", { description: res?.error });
    }
    router.refresh();
    toast.success("Field deleted", {
      description: "Field has been deleted successfully",
      classNames: { description: "!text-black" },
    });
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <EditField Field={field}>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="h-4 w-4" />
              <span>Edit field definition</span>
            </DropdownMenuItem>
          </EditField>
          <DropdownMenuItem onClick={fieldDelete}>
            <DeleteIcon />
            <span>Delete field definition</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FieldDropDown;
