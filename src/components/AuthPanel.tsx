"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthPanelProps = {
  user: User | null;
  authLoading: boolean;
  configured: boolean;
  onSignIn: (email: string) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export default function AuthPanel({
  user,
  authLoading,
  configured,
  onSignIn,
  onSignOut,
}: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!configured) {
    return (
      <p className="max-w-md mx-auto text-center text-xs text-zinc-400 px-4">
        Add{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-600">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        and{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-600">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        to sync history across devices.
      </p>
    );
  }

  if (authLoading) {
    return (
      <p className="text-center text-sm text-zinc-400" aria-live="polite">
        Checking sign-in…
      </p>
    );
  }

  if (user) {
    const label = user.email ?? "Signed in";
    return (
      <div className="flex flex-col items-center gap-2 w-full max-w-md mx-auto">
        <p className="text-sm text-zinc-500 text-center">
          Signed in as <span className="font-medium text-zinc-700">{label}</span>
          {" · "}
          history syncs to your account
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full text-zinc-600 border-zinc-200"
          onClick={() => {
            setError(null);
            void onSignOut();
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email.");
      return;
    }
    setBusy(true);
    void onSignIn(trimmed)
      .then(() => {
        setMessage("Check your email for the sign-in link.");
        setEmail("");
      })
      .catch((err: Error) => {
        setError(err.message || "Could not send link.");
      })
      .finally(() => setBusy(false));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch gap-3 w-full max-w-md mx-auto"
    >
      <p className="text-center text-sm text-zinc-500">
        Email yourself a magic link to save history across devices
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          className="rounded-2xl border-zinc-200 bg-white flex-1"
        />
        <Button
          type="submit"
          disabled={busy}
          variant="outline"
          className="rounded-full border-zinc-200 text-zinc-700 shrink-0"
        >
          {busy ? "Sending…" : "Email link"}
        </Button>
      </div>
      {message && (
        <p className="text-center text-sm text-emerald-600" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-center text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
