import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Sign-in link problem</h1>
      <p className="max-w-sm text-zinc-500">
        This link may have expired or already been used. Request a new magic link from the app.
      </p>
      <Link href="/" className="text-zinc-900 underline underline-offset-4">
        Back to TimeBoxer
      </Link>
    </div>
  );
}
