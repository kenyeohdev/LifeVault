import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { AVAILABLE_TABS, isValidTabId } from "@/lib/tabs";

export default async function TabPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab: tabId } = await params;
  if (!isValidTabId(tabId)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  if (!user.enabledTabs.includes(tabId)) notFound();

  const tab = AVAILABLE_TABS.find((t) => t.id === tabId)!;

  return (
    <div className="rounded-[20px] border border-border bg-panel p-8 shadow-sm">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full mb-4"
        style={{ background: `var(--${tab.accent})` }}
      />
      <h1 className="font-[family-name:var(--font-serif)] text-3xl mb-2">{tab.label}</h1>
      <p className="text-muted max-w-xl">
        {tab.description} This tab&apos;s tracker UI isn&apos;t built yet — it&apos;s next up.
      </p>
    </div>
  );
}
