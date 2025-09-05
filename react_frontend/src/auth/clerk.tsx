import React from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * getClerkPublishableKey
 * Returns the Clerk Publishable Key from environment variables.
 * Note: The orchestrator should set VITE_CLERK_PUBLISHABLE_KEY in .env.
 */
export function getClerkPublishableKey(): string {
  const key = (import.meta.env as Record<string, unknown>)[
    "VITE_CLERK_PUBLISHABLE_KEY"
  ] as string | undefined;
  if (!key) {
    // We keep a descriptive error for DX. In production this should be set via envs.
    console.warn(
      "Clerk publishable key missing. Please set VITE_CLERK_PUBLISHABLE_KEY in your environment."
    );
    return "";
  }
  return key;
}

/**
 * PUBLIC_INTERFACE
 * AppAuthProvider
 * Wraps the application with ClerkProvider and wires navigation for Clerk components.
 */
export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const publishableKey = getClerkPublishableKey();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      routerPush={(to: string) => navigate(to)}
      routerReplace={(to: string) => navigate(to, { replace: true })}
      /* Map Clerk paths to our app routes */
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * Minimal route guard: renders children if signed in, else redirects to /sign-in.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isSignedIn) {
    // Use anchor to trigger client-side navigation without importing hooks here
    return (
      <div className="space-y-3">
        <p className="text-sm">You must sign in to view this page.</p>
        <a
          href="/sign-in"
          className="inline-block text-primary underline underline-offset-4"
        >
          Go to Sign In
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * PUBLIC_INTERFACE
 * AuthPages
 * Provides bundled SignIn and SignUp components using Clerk defaults with our theming container.
 */
export function SignInPage() {
  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="w-full max-w-md border rounded-lg p-6">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary text-primary-foreground",
            },
          }}
        />
      </div>
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="w-full max-w-md border rounded-lg p-6">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary text-primary-foreground",
            },
          }}
        />
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * AuthControls
 * Small helper that renders either a sign-in link or a user menu button.
 */
export function AuthControls() {
  return (
    <>
      <SignedOut>
        <a
          href="/sign-in"
          className="text-sm no-underline text-foreground/80 hover:text-primary"
          aria-label="Go to sign in page"
        >
          Sign In
        </a>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </>
  );
}
