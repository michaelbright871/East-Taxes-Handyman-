import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Choose a new password — Control Center" },
      { name: "description", content: "Set a new password for your East Texas Handyman staff account." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    void navigate({ to: "/admin" as never, replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/25 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border/70 bg-card p-5 shadow-sm"
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <KeyRound className="size-4" />
          </span>
          <h1 className="mt-3 text-base font-semibold">Choose a new password</h1>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">New password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Confirm password</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Update password
        </Button>
      </form>
    </div>
  );
}
