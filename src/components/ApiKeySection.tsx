"use client";
import { useState, useTransition } from "react";
import {
  createApiKey,
  deleteApiKey,
} from "@/app/settings/[id]/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Trash2, Plus, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ExistingKey = {
  id: string;
  preview: string;
  createdAt: string;
};

type Props = {
  projectId: string;
  userId: string;
  existingKeys: ExistingKey[];
};

export default function ApiKeySection({
  projectId,
  userId,
  existingKeys,
}: Props) {
  const [keys, setKeys] = useState<ExistingKey[]>(existingKeys);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createApiKey(userId, projectId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setNewKey(result.raw);
      setShowDialog(true);
      setKeys((prev) => [
        {
          id: "new",
          preview: `${result.raw.slice(0, 8)}${"•".repeat(24)}`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
  };

  const handleDelete = (keyId: string) => {
    startTransition(async () => {
      const result = await deleteApiKey(keyId, projectId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setKeys((prev) => prev.filter((k) => k.id !== keyId));
      toast.success("Key deleted");
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-4">
      {/* Existing keys */}
      {keys.length === 0 ? (
        <div className="text-sm text-muted-foreground py-6 text-center border rounded-md border-dashed">
          No API keys yet. Create one to start fetching content.
        </div>
      ) : (
        <div className="divide-y divide-border border rounded-md">
          {keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between px-4 py-3 gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-mono text-sm truncate">
                  {key.preview}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {new Date(key.createdAt).toLocaleDateString()}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete API key?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Any application using this key will immediately lose
                        access. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(key.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleCreate}
        disabled={isPending}
      >
        <Plus className="w-4 h-4 mr-2" />
        {isPending ? "Generating..." : "Generate new key"}
      </Button>

      {/* One-time reveal dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your new API key</DialogTitle>
            <DialogDescription>
              Copy this now — it won't be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 mt-2">
            <span className="font-mono text-sm break-all flex-1">{newKey}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => handleCopy(newKey!)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Pass this as the{" "}
            <code className="bg-muted px-1 rounded">x-api-key</code> header in
            your requests.
          </p>
          <Button
            type="button"
            className="mt-2 w-full"
            onClick={() => setShowDialog(false)}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
