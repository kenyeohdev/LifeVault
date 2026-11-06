import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// The signed-in person's LifeVault profile row, or null if they've signed up
// with Clerk but haven't finished onboarding (no row created yet).
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { clerkId: userId } });
}
