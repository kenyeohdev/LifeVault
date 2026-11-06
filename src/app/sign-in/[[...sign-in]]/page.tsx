import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex-1 flex items-center justify-center bg-background p-6">
      <SignIn />
    </main>
  );
}
