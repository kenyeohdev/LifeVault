import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-xs font-semibold tracking-[0.12em] text-sage-text uppercase mb-3">
          Wealth Planner
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-6xl mb-6 max-w-2xl">
          Your whole financial picture, in one place.
        </h1>
        <p className="text-muted text-lg max-w-xl mb-10">
          Insurance, property, bank accounts and investments — tracked together,
          so you always know where you stand. Pick only the tabs you need.
        </p>
        <div className="flex gap-3">
          <Link
            href="/sign-up"
            className="rounded-full bg-hero-1 text-hero-text px-6 py-3 text-sm font-semibold shadow-sm hover:opacity-90 transition"
          >
            Get started
          </Link>
          <Link
            href="/sign-in"
            className="rounded-full border border-border bg-panel px-6 py-3 text-sm font-semibold hover:bg-panel-alt transition"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Insurance", accent: "rose" },
            { label: "Property", accent: "clay" },
            { label: "Bank Accounts", accent: "tan" },
            { label: "Other Assets", accent: "stone" },
            { label: "Savings & Investments", accent: "sage" },
          ].map((t) => (
            <div
              key={t.label}
              className="rounded-[18px] border border-border bg-panel p-5 shadow-sm"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full mb-3"
                style={{ background: `var(--${t.accent})` }}
              />
              <div className="text-sm font-medium">{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
