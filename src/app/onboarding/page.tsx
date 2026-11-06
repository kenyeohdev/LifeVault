import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) redirect("/dashboard");

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold tracking-[0.12em] text-sage-text uppercase mb-3">
          Wealth Planner
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl mb-2">
          Welcome to LifeVault
        </h1>
        <p className="text-muted mb-10">
          A couple of details, then you&apos;re in.
        </p>
        <OnboardingForm defaultEmail={email} />
      </div>
    </main>
  );
}
