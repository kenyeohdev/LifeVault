import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { AVAILABLE_TABS } from "@/lib/tabs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");

  const enabledTabs = AVAILABLE_TABS.filter((t) => user.enabledTabs.includes(t.id));

  return (
    <div className="flex-1 bg-background text-foreground">
      <header className="border-b border-border bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-[family-name:var(--font-serif)] text-xl">
            LifeVault
          </Link>
          <UserButton />
        </div>
        <nav className="mx-auto max-w-6xl px-6 pb-3 flex flex-wrap gap-1.5">
          <Link
            href="/dashboard"
            className="rounded-full px-4 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-panel-alt transition"
          >
            Overview
          </Link>
          {enabledTabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/${tab.id}`}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-panel-alt transition"
            >
              {tab.label}
            </Link>
          ))}
          <Link
            href="/dashboard/settings"
            className="rounded-full px-4 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-panel-alt transition"
          >
            Settings
          </Link>
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
