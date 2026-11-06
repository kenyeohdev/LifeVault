import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { calculateAge } from "@/lib/age";
import { AVAILABLE_TABS } from "@/lib/tabs";

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");

  const age = calculateAge(user.dob);
  const enabledTabs = AVAILABLE_TABS.filter((t) => user.enabledTabs.includes(t.id));

  return (
    <div className="space-y-10">
      <div className="rounded-[20px] border border-border bg-panel p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-semibold tracking-[0.1em] text-sage-text uppercase mb-4">
          Your details
        </p>
        <dl className="grid gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted mb-1">Name</dt>
            <dd className="font-[family-name:var(--font-serif)] text-2xl">
              {user.name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted mb-1">Date of birth</dt>
            <dd className="font-[family-name:var(--font-serif)] text-2xl">
              {user.dob
                ? new Date(user.dob).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted mb-1">Age</dt>
            <dd className="font-[family-name:var(--font-serif)] text-2xl">
              {age ?? "—"}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-[0.1em] text-muted uppercase mb-4">
          Your tabs
        </p>
        {enabledTabs.length === 0 ? (
          <p className="text-sm text-muted">
            You haven&apos;t enabled any tabs yet — turn some on from Settings.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enabledTabs.map((tab) => (
              <a
                key={tab.id}
                href={`/dashboard/${tab.id}`}
                className="rounded-[18px] border border-border bg-panel p-5 shadow-sm hover:shadow-md transition block"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full mb-3"
                  style={{ background: `var(--${tab.accent})` }}
                />
                <div className="text-sm font-medium">{tab.label}</div>
                <div className="text-xs text-muted mt-1">{tab.description}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
