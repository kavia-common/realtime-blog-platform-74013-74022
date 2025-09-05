import React from "react";
import { useUser } from "@clerk/clerk-react";
import { FadeIn } from "../../components/animations/FadeIn";
import ProfileForm from "../../components/profile/ProfileForm";

/**
 * PUBLIC_INTERFACE
 * SettingsPage
 * Account and blog settings: includes Profile form for username + avatar override.
 */
export default function SettingsPage(): JSX.Element {
  const { user } = useUser();

  return (
    <section className="space-y-6">
      <FadeIn as="header" className="space-y-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account profile and preferences.
        </p>
      </FadeIn>

      <FadeIn className="grid gap-4 rounded-md border p-4">
        <div className="flex items-center gap-3">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Current user avatar"
              className="h-10 w-10 rounded-full border object-cover"
            />
          ) : null}
          <div>
            <div className="font-medium">{user?.fullName || user?.username || "Anonymous"}</div>
            <div className="text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || "No email"}
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="rounded-md border p-4">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your username and avatar. Avatar overrides your Clerk profile image when provided.
          </p>
        </div>
        <ProfileForm
          onUpdated={() => {
            // No-op: Convex will propagate to consumers when backend is live.
          }}
        />
      </FadeIn>
    </section>
  );
}
