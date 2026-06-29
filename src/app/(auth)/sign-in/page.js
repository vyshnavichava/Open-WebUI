"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/chat";

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
      <SignIn redirectUrl={redirectUrl} />
    </div>
  );
}
