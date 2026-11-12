"use client";

import { useState } from "react";
import Link from "next/link";

type BillingCycle = "monthly" | "annual";

interface Tier {
  id: string;
  name: string;
  description: string;
  annualTotal: number | null; // null = custom pricing
  badge?: { label: string; accent: "sage" | "clay" };
  highlighted?: boolean;
  features: string[];
  cta: { label: string; href: string };
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started with essential wealth tracking.",
    annualTotal: 0,
    features: [
      "Up to 2 categories",
      "Core dashboard (name, DOB, age)",
      "Email support",
    ],
    cta: { label: "Get started", href: "/sign-up" },
  },
  {
    id: "individual",
    name: "Individual",
    description: "The complete picture for one person.",
    annualTotal: 99,
    badge: { label: "Most popular", accent: "sage" },
    highlighted: true,
    features: [
      "All 5 categories",
      "Insurance, Property, Bank, Other Assets, Savings & Investments",
      "Unlimited entries per category",
      "Priority email support",
    ],
    cta: { label: "Get started", href: "/sign-up" },
  },
  {
    id: "family",
    name: "Family",
    description: "Track your whole household together.",
    annualTotal: 249,
    badge: { label: "Best value", accent: "clay" },
    features: [
      "Everything in Individual",
      "Up to 6 family members",
      "Shared household view",
      "Priority phone support",
    ],
    cta: { label: "Get started", href: "/sign-up" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For firms managing wealth on behalf of clients.",
    annualTotal: null,
    features: [
      "Everything in Family",
      "Multiple client workspaces",
      "API access",
      "Dedicated support",
    ],
    cta: { label: "Talk to sales", href: "mailto:hello@lifevault.app" },
  },
];

function monthlyBilledPrice(annualTotal: number): number {
  // The annual price already bakes in a 20% discount vs. paying monthly.
  return Math.round(annualTotal / 0.8 / 12);
}

function annualEquivalentPerMonth(annualTotal: number): number {
  return Math.round(annualTotal / 12);
}

const badgeClasses: Record<"sage" | "clay", string> = {
  sage: "bg-sage-soft text-sage-text",
  clay: "bg-clay-soft text-clay-text",
};

export default function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.12em] text-sage-text uppercase mb-3">
            Pricing
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl sm:text-5xl mb-4">
            One plan for every household
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Start free. Upgrade when you want every category tracked in one
            place.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-panel p-1">
            <button
              type="button"
              onClick={() => setCycle("monthly")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                cycle === "monthly"
                  ? "bg-panel-alt text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setCycle("annual")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                cycle === "annual"
                  ? "bg-hero-1 text-hero-text"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Annual
              <span className="rounded-full bg-sage-soft text-sage-text text-xs font-semibold px-2 py-0.5">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => {
            const isCustom = tier.annualTotal === null;
            const displayPrice = isCustom
              ? "Custom"
              : cycle === "annual"
                ? `$${tier.annualTotal}`
                : `$${monthlyBilledPrice(tier.annualTotal!)}`;
            const priceSuffix = isCustom
              ? ""
              : cycle === "annual"
                ? "/year"
                : "/month";
            const subPrice =
              !isCustom && tier.annualTotal! > 0
                ? cycle === "annual"
                  ? `$${annualEquivalentPerMonth(tier.annualTotal!)}/month billed annually`
                  : "billed monthly"
                : null;

            return (
              <div
                key={tier.id}
                className={`relative rounded-[18px] border p-6 flex flex-col ${
                  tier.highlighted
                    ? "border-hero-1 bg-hero-1 text-hero-text shadow-md"
                    : "border-border bg-panel"
                }`}
              >
                {tier.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full text-xs font-semibold px-3 py-1 ${badgeClasses[tier.badge.accent]}`}
                  >
                    {tier.badge.label}
                  </span>
                )}

                <div
                  className={`text-sm font-medium mb-1 ${tier.highlighted ? "text-hero-text" : "text-foreground"}`}
                >
                  {tier.name}
                </div>
                <p
                  className={`text-sm mb-5 ${tier.highlighted ? "text-hero-accent" : "text-muted"}`}
                >
                  {tier.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-semibold">
                    {displayPrice}
                  </span>
                  <span
                    className={`text-sm ${tier.highlighted ? "text-hero-accent" : "text-muted"}`}
                  >
                    {priceSuffix}
                  </span>
                  {subPrice && (
                    <div
                      className={`text-xs mt-1 ${tier.highlighted ? "text-hero-accent" : "text-muted"}`}
                    >
                      {subPrice}
                    </div>
                  )}
                </div>

                <Link
                  href={tier.cta.href}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold text-center transition mb-6 ${
                    tier.highlighted
                      ? "bg-hero-text text-hero-1 hover:opacity-90"
                      : "border border-border bg-panel-alt hover:bg-panel"
                  }`}
                >
                  {tier.cta.label}
                </Link>

                <ul
                  className={`space-y-3 text-sm ${tier.highlighted ? "text-hero-text" : "text-foreground"}`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span
                        className={
                          tier.highlighted ? "text-hero-accent" : "text-sage-text"
                        }
                      >
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
