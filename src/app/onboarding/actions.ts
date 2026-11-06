"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isValidTabId } from "@/lib/tabs";

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const name = String(formData.get("name") || "").trim();
  const dobRaw = String(formData.get("dob") || "");
  const dob = dobRaw ? new Date(dobRaw) : null;

  const enabledTabs = formData
    .getAll("tabs")
    .map(String)
    .filter(isValidTabId);

  if (!name) {
    throw new Error("Name is required.");
  }
  if (!dob || Number.isNaN(dob.getTime())) {
    throw new Error("A valid date of birth is required.");
  }
  if (enabledTabs.length === 0) {
    throw new Error("Pick at least one tab to get started.");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: { name, dob, enabledTabs },
    create: { clerkId: userId, email, name, dob, enabledTabs },
  });

  redirect("/dashboard");
}
