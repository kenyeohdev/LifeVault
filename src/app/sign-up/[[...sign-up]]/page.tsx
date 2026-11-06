import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex-1 flex items-center justify-center bg-background p-6">
      <SignUp />
    </main>
  );
}
