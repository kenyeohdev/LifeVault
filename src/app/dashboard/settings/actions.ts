"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isValidTabId } from "@/lib/tabs";

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not signed in.");

  const name = String(formData.get("name") || "").trim();
  const dobRaw = String(formData.get("dob") || "");
  const dob = dobRaw ? new Date(dobRaw) : null;
  const enabledTabs = formData.getAll("tabs").map(String).filter(isValidTabId);

  if (!name) throw new Error("Name is required.");
  if (!dob || Number.isNaN(dob.getTime())) throw new Error("A valid date of birth is required.");

  await prisma.user.update({
    where: { clerkId: userId },
    data: { name, dob, enabledTabs },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}
