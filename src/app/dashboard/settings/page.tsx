import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { calculateAge } from "@/lib/age";
import type { TabId } from "@/lib/tabs";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");

  const age = calculateAge(user.dob);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl mb-1">Settings</h1>
        <p className="text-muted text-sm">
          {user.name} · {age !== null ? `${age} years old` : "Age unknown"}
        </p>
      </div>
      <SettingsForm
        initialName={user.name ?? ""}
        initialDob={user.dob ? new Date(user.dob).toISOString().slice(0, 10) : ""}
        initialTabs={user.enabledTabs as TabId[]}
      />
    </div>
  );
}
