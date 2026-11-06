"use client";

import { useState } from "react";
import { AVAILABLE_TABS, type TabId } from "@/lib/tabs";
import { completeOnboarding } from "./actions";

export function OnboardingForm({ defaultEmail }: { defaultEmail: string }) {
  const [selected, setSelected] = useState<Set<TabId>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
        setError(null);
        setPending(true);
        try {
          await completeOnboarding(formData);
        } catch (e) {
          setPending(false);
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
            placeholder="Your full name"
            className="mt-1.5 w-full rounded-xl border border-border bg-panel px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage-soft"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Date of birth</span>
          <input
            name="dob"
            type="date"
            required
            max={new Date().toISOString().slice(0, 10)}
            className="mt-1.5 w-full rounded-xl border border-border bg-panel px-3.5 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage-soft"
          />
        </label>
      </div>
      <p className="text-xs text-muted">Signing up as {defaultEmail}</p>

      <div>
        <span className="text-sm font-medium text-foreground">
          Which tabs do you want to track?
        </span>
        <p className="text-xs text-muted mt-1 mb-4">
          You can change this anytime from Settings.
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

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-hero-1 text-hero-text px-6 py-3 text-sm font-semibold shadow-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {pending ? "Setting up…" : "Finish setup"}
      </button>
    </form>
  );
}
