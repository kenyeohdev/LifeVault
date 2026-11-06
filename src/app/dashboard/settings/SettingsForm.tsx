"use client";

import { useState } from "react";
import { AVAILABLE_TABS, type TabId } from "@/lib/tabs";
import { updateProfile } from "./actions";

export function SettingsForm({
  initialName,
  initialDob,
  initialTabs,
}: {
  initialName: string;
  initialDob: string;
  initialTabs: TabId[];
}) {
  const [selected, setSelected] = useState<Set<TabId>>(new Set(initialTabs));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function toggle(id: TabId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form
      action={async (formData) => {
        setStatus("saving");
        setError(null);
        try {
          await updateProfile(formData);
          setStatus("saved");
        } catch (e) {
          setStatus("error");
          setError(e instanceof Error ? e.message : "Something went wrong.");
        }
      }}
      className="space-y-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Name</span>
          <input
            name="name"
            type="text"
            required
            defaultValue={initialName}
            className="mt-1.5 w-full rounded-xl border border-border bg-panel px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage-soft"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Date of birth</span>
          <input
            name="dob"
            type="date"
            required
            defaultValue={initialDob}
            max={new Date().toISOString().slice(0, 10)}
            className="mt-1.5 w-full rounded-xl border border-border bg-panel px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage-soft"
          />
        </label>
      </div>

      <div>
        <span className="text-sm font-medium text-foreground">Tabs</span>
        <p className="text-xs text-muted mt-1 mb-4">
          Turn categories on or off — your data isn&apos;t deleted when you turn one off.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {AVAILABLE_TABS.map((tab) => {
            const checked = selected.has(tab.id);
            return (
              <label
                key={tab.id}
                className={`flex items-start gap-3 rounded-[16px] border p-4 cursor-pointer transition ${
                  checked
                    ? "border-sage bg-sage-soft"
                    : "border-border bg-panel hover:bg-panel-alt"
                }`}
              >
                <input
                  type="checkbox"
                  name="tabs"
                  value={tab.id}
                  checked={checked}
                  onChange={() => toggle(tab.id)}
                  className="mt-0.5 accent-sage"
                />
                <span>
                  <span
                    className="inline-block h-2 w-2 rounded-full mr-2 align-middle"
                    style={{ background: `var(--${tab.accent})` }}
                  />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <span className="block text-xs text-muted mt-0.5">
                    {tab.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-sm text-rose-text bg-rose-soft rounded-lg px-3.5 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-hero-1 text-hero-text px-6 py-3 text-sm font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-sage-text">Saved.</span>
        )}
      </div>
    </form>
  );
}
