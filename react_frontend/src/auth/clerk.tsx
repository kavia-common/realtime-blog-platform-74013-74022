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

/**
 * PUBLIC_INTERFACE
 * getClerkPublishableKey
 * Returns the Clerk Publishable Key from environment variables.
 * Note: The orchestrator should set VITE_CLERK_PUBLISHABLE_KEY in .env.
 */
export function getClerkPublishableKey(): string | null {
  const key = (import.meta.env as Record<string, unknown>)[
    "VITE_CLERK_PUBLISHABLE_KEY"
  ] as string | undefined;
  if (!key || typeof key !== "string" || key.trim() === "") {
    console.warn(
      "Clerk publishable key missing. Please set VITE_CLERK_PUBLISHABLE_KEY in your environment."
    );
    return null;
  }
  return key;
}

/**
 * PUBLIC_INTERFACE
 * AppAuthProvider
 * Wraps the application with ClerkProvider when a valid key is present.
 * If missing, renders children and a visible configuration warning to avoid blank screens.
 */
export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = getClerkPublishableKey();

  if (!publishableKey) {
    // Render children without Clerk to prevent runtime crashes; add a visible warning banner.
    return (
      <div className="min-h-screen grid grid-rows-[auto_1fr]">
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 px-4 py-2 text-sm" role="alert" aria-live="polite">
          Authentication is not configured. Set VITE_CLERK_PUBLISHABLE_KEY in your .env to enable the dashboard and auth flows.
        </div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      /* Map Clerk paths to our app routes */
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * Minimal route guard: renders children if signed in.
 * If Clerk is not initialized (e.g., missing key), show a helpful message instead of blanking.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  let authState: { isLoaded?: boolean; isSignedIn?: boolean } = {};
  try {
    authState = useAuth();
  } catch (e) {
    void e; // satisfy eslint no-unused-vars if thrown value is not referenced
    // useAuth threw likely because ClerkProvider isn't mounted (missing key)
    return (
      <div className="space-y-3">
        <p className="text-sm">
          Authentication is not available. Please configure VITE_CLERK_PUBLISHABLE_KEY to access the dashboard.
        </p>
      </div>
    );
  }

  const { isLoaded, isSignedIn } = authState;

  if (!isLoaded) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isSignedIn) {
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
 * If Clerk is unavailable, show a Sign In link that routes to /sign-in for consistency.
 */
export function AuthControls() {
  let hasClerk = true;
  try {
    // attempt to access SignedIn/SignedOut context by rendering them; if it throws, fall back.
    void useAuth();
  } catch {
    hasClerk = false;
  }

  if (!hasClerk) {
    return (
      <a
        href="/sign-in"
        className="text-sm no-underline text-foreground/80 hover:text-primary"
        aria-label="Go to sign in page"
      >
        Sign In
      </a>
    );
  }

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
