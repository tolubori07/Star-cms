"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { logOutAction } from "@/app/login/actions"; 
import { toast } from "sonner";


export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const res = await logOutAction();

        if (res.errorMessage) {
          toast.error(res.errorMessage)
        } else {
          // Optionally redirect or refresh page
          router.push("/login");
        }
      } catch (err) {
        toast.error("Something went wrong...")
      }
    });
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        disabled={isPending}
        className="text-lg font-heading"
      >
        {isPending ? "Logging out..." : "Logout"}
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOutIcon className="mr-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

