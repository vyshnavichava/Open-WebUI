"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="w-full p-4 bg-gray-900 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">ObsidianGPT</h1>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <>
            <SignInButton>
              <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition">
                Sign Up
              </button>
            </SignUpButton>
          </>
        )}
      </div>
    </header>
  );
}
