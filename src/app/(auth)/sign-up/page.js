"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/chat";

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      <SignUp redirectUrl={redirectUrl} />
    </div>
  );
}
