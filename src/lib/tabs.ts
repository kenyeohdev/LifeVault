// The wealth-tracker categories a user can turn on for themselves.
// Keep this list in sync with the `enabledTabs` field in prisma/schema.prisma.
export type TabId = "insurance" | "property" | "bank" | "other" | "savings";

export interface TabDefinition {
  id: TabId;
  label: string;
  description: string;
  accent: "rose" | "clay" | "tan" | "stone" | "sage";
}

export const AVAILABLE_TABS: TabDefinition[] = [
  {
    id: "insurance",
    label: "Insurance",
    description: "Policies, coverage, premiums and cash/surrender values.",
    accent: "rose",
  },
  {
    id: "property",
    label: "Property",
    description: "Properties you own, current value and loan outstanding.",
    accent: "clay",
  },
  {
    id: "bank",
    label: "Bank Accounts",
    description: "Savings, current and fixed deposit accounts.",
    accent: "tan",
  },
  {
    id: "other",
    label: "Other Assets",
    description: "Anything else with value — vehicles, collectibles, etc.",
    accent: "stone",
  },
  {
    id: "savings",
    label: "Savings & Investments",
    description: "EPF, unit trusts and other investment accounts.",
    accent: "sage",
  },
];

export function isValidTabId(id: string): id is TabId {
  return AVAILABLE_TABS.some((t) => t.id === id);
}
